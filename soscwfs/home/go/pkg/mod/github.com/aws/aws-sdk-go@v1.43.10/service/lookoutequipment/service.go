// Code generated by private/model/cli/gen-api/main.go. DO NOT EDIT.

package lookoutequipment

import (
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/client"
	"github.com/aws/aws-sdk-go/aws/client/metadata"
	"github.com/aws/aws-sdk-go/aws/request"
	"github.com/aws/aws-sdk-go/aws/signer/v4"
	"github.com/aws/aws-sdk-go/private/protocol"
	"github.com/aws/aws-sdk-go/private/protocol/jsonrpc"
)

// LookoutEquipment provides the API operation methods for making requests to
// Amazon Lookout for Equipment. See this package's package overview docs
// for details on the service.
//
// LookoutEquipment methods are safe to use concurrently. It is not safe to
// modify mutate any of the struct's properties though.
type LookoutEquipment struct {
	*client.Client
}

// Used for custom client initialization logic
var initClient func(*client.Client)

// Used for custom request initialization logic
var initRequest func(*request.Request)

// Service information constants
const (
	ServiceName = "LookoutEquipment" // Name of service.
	EndpointsID = "lookoutequipment" // ID to lookup a service endpoint with.
	ServiceID   = "LookoutEquipment" // ServiceID is a unique identifier of a specific service.
)

// New creates a new instance of the LookoutEquipment client with a session.
// If additional configuration is needed for the client instance use the optional
// aws.Config parameter to add your extra config.
//
// Example:
//     mySession := session.Must(session.NewSession())
//
//     // Create a LookoutEquipment client from just a session.
//     svc := lookoutequipment.New(mySession)
//
//     // Create a LookoutEquipment client with additional configuration
//     svc := lookoutequipment.New(mySession, aws.NewConfig().WithRegion("us-west-2"))
func New(p client.ConfigProvider, cfgs ...*aws.Config) *LookoutEquipment {
	c := p.ClientConfig(EndpointsID, cfgs...)
	if c.SigningNameDerived || len(c.SigningName) == 0 {
		c.SigningName = EndpointsID
		// No Fallback
	}
	return newClient(*c.Config, c.Handlers, c.PartitionID, c.Endpoint, c.SigningRegion, c.SigningName, c.ResolvedRegion)
}

// newClient creates, initializes and returns a new service client instance.
func newClient(cfg aws.Config, handlers request.Handlers, partitionID, endpoint, signingRegion, signingName, resolvedRegion string) *LookoutEquipment {
	svc := &LookoutEquipment{
		Client: client.New(
			cfg,
			metadata.ClientInfo{
				ServiceName:    ServiceName,
				ServiceID:      ServiceID,
				SigningName:    signingName,
				SigningRegion:  signingRegion,
				PartitionID:    partitionID,
				Endpoint:       endpoint,
				APIVersion:     "2020-12-15",
				ResolvedRegion: resolvedRegion,
				JSONVersion:    "1.0",
				TargetPrefix:   "AWSLookoutEquipmentFrontendService",
			},
			handlers,
		),
	}

	// Handlers
	svc.Handlers.Sign.PushBackNamed(v4.SignRequestHandler)
	svc.Handlers.Build.PushBackNamed(jsonrpc.BuildHandler)
	svc.Handlers.Unmarshal.PushBackNamed(jsonrpc.UnmarshalHandler)
	svc.Handlers.UnmarshalMeta.PushBackNamed(jsonrpc.UnmarshalMetaHandler)
	svc.Handlers.UnmarshalError.PushBackNamed(
		protocol.NewUnmarshalErrorHandler(jsonrpc.NewUnmarshalTypedError(exceptionFromCode)).NamedHandler(),
	)

	// Run custom client initialization if present
	if initClient != nil {
		initClient(svc.Client)
	}

	return svc
}

// newRequest creates a new request for a LookoutEquipment operation and runs any
// custom request initialization.
func (c *LookoutEquipment) newRequest(op *request.Operation, params, data interface{}) *request.Request {
	req := c.NewRequest(op, params, data)

	// Run custom request initialization if present
	if initRequest != nil {
		initRequest(req)
	}

	return req
}
