package main

import (
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/projectdiscovery/hmap/store/hybrid"
)

func main() {
	var wg sync.WaitGroup
	// wg.Add(1)
	// go normal(&wg)
	// wg.Add(1)
	// go memoryExpire(&wg)
	// wg.Add(1)
	// go disk(&wg)
	// wg.Add(1)
	// go hybridz(&wg)
	// wg.Wait()
	wg.Add(1)
	allDisks(&wg)
	wg.Wait()
}

func normal(wg *sync.WaitGroup) {
	defer wg.Done()
	hm, err := hybrid.New(hybrid.DefaultOptions)
	if err != nil {
		log.Fatal(err)
	}
	defer hm.Close()
	err2 := hm.Set("a", []byte("b"))
	if err2 != nil {
		log.Fatal(err2)
	}
	v, ok := hm.Get("a")
	if ok {
		log.Println(v)
	}
}

func memoryExpire(wg *sync.WaitGroup) {
	defer wg.Done()
	hm, err := hybrid.New(hybrid.Options{
		Type:                 hybrid.Memory,
		MemoryExpirationTime: time.Duration(10) * time.Second,
		JanitorTime:          time.Duration(5) * time.Second,
	})
	if err != nil {
		log.Fatal(err)
	}
	defer hm.Close()
	err2 := hm.Set("a", []byte("b"))
	if err2 != nil {
		log.Fatal(err2)
	}
	time.Sleep(time.Duration(15) * time.Second)
	v, ok := hm.Get("a")
	if ok && len(v) == 0 {
		log.Printf("error: item should be evicted")
		return
	}
	log.Printf("item evicted")
}

func disk(wg *sync.WaitGroup) {
	defer wg.Done()
	hm, err := hybrid.New(hybrid.DefaultDiskOptions)
	if err != nil {
		log.Fatal(err)
	}
	defer hm.Close()
	err2 := hm.Set("a", []byte("b"))
	if err2 != nil {
		log.Fatal(err2)
	}
	v, ok := hm.Get("a")
	if ok {
		log.Println(string(v))
		return
	}
	log.Printf("error: not found")
}

func hybridz(wg *sync.WaitGroup) {
	defer wg.Done()
	hm, err := hybrid.New(hybrid.Options{
		Type:                 hybrid.Hybrid,
		MemoryExpirationTime: time.Duration(60) * time.Second,
		MemoryGuard:          true,
		MemoryGuardTime:      time.Duration(5) * time.Second,
		JanitorTime:          time.Duration(5) * time.Second,
		MaxMemorySize:        1024,
	})
	if err != nil {
		log.Fatal(err)
	}
	defer hm.Close()
	err2 := hm.Set("a", []byte("b"))
	if err2 != nil {
		log.Fatal(err2)
	}
	time.Sleep(time.Duration(15) * time.Second)
	// this should happen from disk
	v, ok := hm.Get("a")
	if ok {
		log.Println("Read1 (disk)", v)
	} else {
		log.Println("Read1 (disk) Not found")
	}

	log.Println("Writing 1M")
	for i := 0; i < 1000000; i++ {
		v := fmt.Sprintf("%d", i)
		hm.Set(v, []byte(v))
	}
	log.Println("Finished writing 1M")

	time.Sleep(time.Duration(15) * time.Second)
	// this should happen from memory again
	v3, ok3 := hm.Get("a")
	if ok3 {
		log.Println("Read2 (memory)", v3)
	} else {
		log.Println("Read2 (memory) Not found")
	}
}

func allDisks(wg *sync.WaitGroup) error {
	defer wg.Done()

	total := 10000000

	opts := hybrid.DefaultDiskOptions
	// leveldb
	opts.DBType = hybrid.LevelDB
	_, err := testhybrid("leveldb", opts, total)
	if err != nil {
		return err
	}

	// badger
	opts.DBType = hybrid.BadgerDB
	_, err = testhybrid("badger", opts, total)
	if err != nil {
		return err
	}

	// pogreb
	opts.DBType = hybrid.PogrebDB
	_, err = testhybrid("pogreb", opts, total)
	if err != nil {
		return err
	}

	// bbolt
	opts.DBType = hybrid.BBoltDB
	_, err = testhybrid("bbolt", opts, total)
	if err != nil {
		return err
	}

	return nil
}

func testhybrid(name string, opts hybrid.Options, total int) (duration time.Duration, err error) {
	start := time.Now()

	log.Println("starting:", name)

	hm, err := hybrid.New(opts)
	if err != nil {
		log.Fatal(err)
	}

	// write
	written := 0
	for i := 0; i < total; i++ {
		if err = hm.Set(fmt.Sprint(i), []byte("test")); err != nil {
			duration = time.Since(start)
			return
		}
		written++
	}

	// scan
	read := 0
	hm.Scan(func(k, v []byte) error {
		_, _ = k, v
		read++
		return nil
	})

	err = hm.Close()
	duration = time.Since(start)
	log.Printf("written: %d,read %d, took:%s\n", written, read, duration)
	return
}
