package cryptoutil

import (
	"crypto/sha256"
	"encoding/json"
	"errors"

	ztls "github.com/zmap/zcrypto/tls"
)

// ZTLSData contains the relevant Transport Layer Security information from ztls
type ZTLSData struct {
	TLSVersion               string   `json:"tls_version,omitempty"`
	ExtensionServerName      string   `json:"extension_server_name,omitempty"`
	DNSNames                 []string `json:"dns_names,omitempty"`
	Emails                   []string `json:"emails,omitempty"`
	CommonName               []string `json:"common_name,omitempty"`
	Organization             []string `json:"organization,omitempty"`
	IssuerCommonName         []string `json:"issuer_common_name,omitempty"`
	IssuerOrg                []string `json:"issuer_organization,omitempty"`
	FingerprintSHA256        string   `json:"fingerprint_sha256,omitempty"`
	FingerprintSHA256OpenSSL string   `json:"fingerprint_sha256_openssl,omitempty"`
	ClientHello              []byte   `json:"client_hello,omitempty"`
	HandshakeLog             []byte   `json:"handshake_log,omitempty"`
	HeartBleedLog            []byte   `json:"heartbleed_log,omitempty"`
}

// ZTLSGrab fills the ZTLSData
func ZTLSGrab(conn *ztls.Conn) *ZTLSData {
	if conn != nil {
		var ztlsdata ZTLSData
		connstate := conn.ConnectionState()
		cert := connstate.PeerCertificates[0]
		ztlsdata.DNSNames = append(ztlsdata.DNSNames, cert.DNSNames...)
		ztlsdata.Emails = append(ztlsdata.Emails, cert.EmailAddresses...)
		ztlsdata.CommonName = append(ztlsdata.CommonName, cert.Subject.CommonName)
		ztlsdata.Organization = append(ztlsdata.Organization, cert.Subject.Organization...)
		ztlsdata.IssuerOrg = append(ztlsdata.IssuerOrg, cert.Issuer.Organization...)
		ztlsdata.IssuerCommonName = append(ztlsdata.IssuerCommonName, cert.Issuer.CommonName)
		ztlsdata.ExtensionServerName = connstate.ServerName
		if v, ok := tlsVersionStringMap[connstate.Version]; ok {
			ztlsdata.TLSVersion = v
		}

		if fingerprintSHA256, err := calculateZFingerprints(&connstate); err == nil {
			ztlsdata.FingerprintSHA256 = asHex(fingerprintSHA256)
			ztlsdata.FingerprintSHA256OpenSSL = asOpenSSL(fingerprintSHA256)
		}
		if clienthello, err := json.Marshal(conn.ClientHelloRaw()); err == nil {
			ztlsdata.ClientHello = clienthello
		}
		if handshakeLog, err := json.Marshal(conn.GetHandshakeLog()); err == nil {
			ztlsdata.HandshakeLog = handshakeLog
		}
		if heartBleedLog, err := json.Marshal(conn.GetHeartbleedLog()); err == nil {
			ztlsdata.HeartBleedLog = heartBleedLog
		}
		return &ztlsdata
	}
	return nil
}

func calculateZFingerprints(c *ztls.ConnectionState) (fingerprintSHA256 []byte, err error) {
	if len(c.PeerCertificates) == 0 {
		err = errors.New("no certificates found")
		return
	}

	cert := c.PeerCertificates[0]
	dataSHA256 := sha256.Sum256(cert.Raw)
	fingerprintSHA256 = dataSHA256[:]
	return
}
