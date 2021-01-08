- peer/core.yaml  
gomaxprocs, keepalive, gossip, authentication, client, deliveryclient
```yaml
    # Setting for runtime.GOMAXPROCS(n). If n < 1, it does not change the
    # current setting
    gomaxprocs: -1

    keepalive:
        # MinInterval is the minimum permitted time between client pings.
        # If clients send pings more frequently, the peer server will
        # disconnect them
        minInterval: 60s
        # Client keepalive settings for communicating with other peer nodes
        client:
            # Interval is the time between pings to peer nodes.  This must
            # greater than or equal to the minInterval specified by peer
            # nodes
            interval: 60s
            # Timeout is the duration the client waits for a response from
            # peer nodes before closing the connection
            timeout: 20s
        # DeliveryClient keepalive settings for communication with ordering
        # nodes.
        deliveryClient:
            # Interval is the time between pings to ordering nodes.  This must
            # greater than or equal to the minInterval specified by ordering
            # nodes.
            interval: 60s
            # Timeout is the duration the client waits for a response from
            # ordering nodes before closing the connection
            timeout: 20s

    gossip:
        # Interval for membershipTracker polling
        membershipTrackerInterval: 5s

        # Overrides the endpoint that the peer publishes to peers
        # in its organization. For peers in foreign organizations
        # see 'externalEndpoint'
        endpoint:
        # Maximum count of blocks stored in memory
        maxBlockCountToStore: 100
        # Max time between consecutive message pushes(unit: millisecond)
        maxPropagationBurstLatency: 10ms
        # Max number of messages stored until a push is triggered to remote peers
        maxPropagationBurstSize: 10
        # Number of times a message is pushed to remote peers
        propagateIterations: 1
        # Number of peers selected to push messages to
        propagatePeerNum: 3
        # Determines frequency of pull phases(unit: second)
        # Must be greater than digestWaitTime + responseWaitTime
        pullInterval: 4s
        # Number of peers to pull from
        pullPeerNum: 3
        # Determines frequency of pulling state info messages from peers(unit: second)
        requestStateInfoInterval: 4s
        # Determines frequency of pushing state info messages to peers(unit: second)
        publishStateInfoInterval: 4s
        # Maximum time a stateInfo message is kept until expired
        stateInfoRetentionInterval:
        # Time from startup certificates are included in Alive messages(unit: second)
        publishCertPeriod: 10s
        # Should we skip verifying block messages or not (currently not in use)
        skipBlockVerification: false
        # Dial timeout(unit: second)
        dialTimeout: 3s
        # Connection timeout(unit: second)
        connTimeout: 2s
        # Buffer size of received messages
        recvBuffSize: 20
        # Buffer size of sending messages
        sendBuffSize: 200
        # Time to wait before pull engine processes incoming digests (unit: second)
        # Should be slightly smaller than requestWaitTime
        digestWaitTime: 1s
        # Time to wait before pull engine removes incoming nonce (unit: milliseconds)
        # Should be slightly bigger than digestWaitTime
        requestWaitTime: 1500ms
        # Time to wait before pull engine ends pull (unit: second)
        responseWaitTime: 2s
        # Alive check interval(unit: second)
        aliveTimeInterval: 5s
        # Alive expiration timeout(unit: second)
        aliveExpirationTimeout: 25s
        # Reconnect interval(unit: second)
        reconnectInterval: 25s
        # This is an endpoint that is published to peers outside of the organization.
        # If this isn't set, the peer will not be known to other organizations.
        externalEndpoint:
        # Leader election service configuration
        election:
            # Longest time peer waits for stable membership during leader election startup (unit: second)
            startupGracePeriod: 15s
            # Interval gossip membership samples to check its stability (unit: second)
            membershipSampleInterval: 1s
            # Time passes since last declaration message before peer decides to perform leader election (unit: second)
            leaderAliveThreshold: 10s
            # Time between peer sends propose message and declares itself as a leader (sends declaration message) (unit: second)
            leaderElectionDuration: 5

    authentication:
        # the acceptable difference between the current server time and the
        # client's time as specified in a client request message
        timewindow: 15m
```

orderer/orderer.yaml
Cluster, Keepalive
```yaml
    # Keepalive settings for the GRPC server.
    Keepalive:
        # Disconnect the client if the time between pings is less than the specified time
        ServerMinInterval: 60s
        # Server pings the clients on open connection with the specified time between pings
        ServerInterval: 7200s
        # Server expects the clients to respond to pings. Server disconnets if response not receieved within timeout
        ServerTimeout: 20s
```

configtx.yaml
BatchTimeout, BatchSize
```yaml
  # Batch Timeout: The amount of time to wait before creating a batch
  BatchTimeout: 2s

  # Batch Size: Controls the number of messages batched into a block
  BatchSize:
    MaxMessageCount: 10
    AbsoluteMaxBytes: 98 MB
    PreferredMaxBytes: 512 KB
```
