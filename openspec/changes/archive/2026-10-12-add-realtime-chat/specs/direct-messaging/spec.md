## ADDED Requirements

### Requirement: Validated direct message submission

A joined sender SHALL submit "message:send" with a target session ID and message text. The server SHALL trim the text, count Unicode code points, accept 1 through 1,000 code points, and reject malformed, blank, or over-limit input without broadcasting.

#### Scenario: Reject blank message

- **WHEN** a joined user submits a message containing only whitespace
- **THEN** the server returns error code "INVALID_MESSAGE" and emits no message event

#### Scenario: Reject over-limit message

- **WHEN** a joined user submits a message longer than 1,000 Unicode code points after trimming
- **THEN** the server returns error code "INVALID_MESSAGE" and emits no message event

### Requirement: Authoritative one-to-one routing

For a valid submission, the server SHALL verify that the target session is connected, create the sender identity from joined socket state, create a UUID and ISO 8601 timestamp, and emit the same "message:received" record only to the sender and target sockets.

#### Scenario: Deliver a direct message to both participants

- **GIVEN** Roy and Bei are joined and Tom is also joined
- **WHEN** Roy sends "hello" to Bei's session ID
- **THEN** Roy and Bei receive one record with the same server-generated ID, sender, target, text, and timestamp, while Tom receives no message record

#### Scenario: Ignore claimed sender identity

- **WHEN** Roy's joined socket submits a payload containing additional claimed sender fields
- **THEN** the delivered message identifies Roy from server session state and ignores the claimed fields

### Requirement: Offline recipient failure

The server SHALL reject a message whose target session is absent and SHALL return error code "RECIPIENT_OFFLINE" without creating or broadcasting a message.

#### Scenario: Target disconnects before send

- **GIVEN** Roy has a chat window for Bei
- **WHEN** Bei disconnects and Roy sends a message to Bei's stale session ID
- **THEN** Roy sees the offline-recipient error and no message appears as delivered

### Requirement: Server-confirmed chat rendering

The frontend SHALL add messages from authoritative "message:received" events, group them by peer session ID, use React text rendering, and avoid optimistic insertion. Enter SHALL send nonblank text and Shift+Enter SHALL insert a newline.

#### Scenario: Render a confirmed message

- **WHEN** a chat window receives a valid authoritative message for its peer
- **THEN** it renders the server sender name, text, and timestamp exactly once

#### Scenario: Surface a rejected send

- **WHEN** a message acknowledgment returns an error
- **THEN** the chat window displays the error and retains the unsent input for correction

### Requirement: Ephemeral message history

Direct messages SHALL exist only in active clients' React state and transient server event objects. The system SHALL NOT persist messages or restore history after a page reload or server restart.

#### Scenario: Reload the browser

- **GIVEN** a chat window contains exchanged messages
- **WHEN** that browser reloads and rejoins
- **THEN** the prior messages are absent
