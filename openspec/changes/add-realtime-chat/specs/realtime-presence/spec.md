## ADDED Requirements

### Requirement: Authoritative visible presence snapshots

After a join, accepted presence update, or disconnect, the server SHALL emit a complete recipient-specific "presence:snapshot" to every joined client. A snapshot SHALL exclude the receiving user and every connected user whose presence is "invisible".

#### Scenario: Two visible users join

- **GIVEN** "Roy" is joined with presence "available"
- **WHEN** "Bei" joins with presence "busy"
- **THEN** Roy's snapshot contains Bei, Bei's snapshot contains Roy, and neither snapshot contains its receiving user

#### Scenario: Invisible user is excluded

- **GIVEN** Roy and Bei are joined and visible
- **WHEN** Bei changes presence to "invisible"
- **THEN** Roy's next snapshot does not contain Bei and Bei continues to receive snapshots of visible users

### Requirement: Presence and custom status updates

A joined user SHALL set presence to exactly one of "available", "busy", "away", or "invisible". The server SHALL trim custom status text, allow 0 through 40 Unicode code points, store the accepted values in memory, and broadcast new snapshots.

#### Scenario: Update presence and custom status

- **GIVEN** Roy is visible to Bei
- **WHEN** Roy updates presence to "busy" and custom status to "Deep work"
- **THEN** Bei's next snapshot represents Roy with presence "busy" and custom status "Deep work"

#### Scenario: Reject invalid presence

- **WHEN** a joined user submits a presence value outside the closed enum
- **THEN** the server returns error code "INVALID_PRESENCE", retains the previous values, and emits no changed snapshot

#### Scenario: Reject an over-limit custom status

- **WHEN** a joined user submits custom status text longer than 40 Unicode code points
- **THEN** the server returns error code "STATUS_TOO_LONG", retains the previous values, and emits no changed snapshot

### Requirement: Invisible discovery semantics

Invisible presence SHALL hide a user from discovery without disconnecting the session. The invisible user SHALL initiate messages or Buzz to visible users, and a peer with the invisible user's session ID from an existing chat SHALL continue to target that connected session.

#### Scenario: Continue an existing chat after becoming invisible

- **GIVEN** Roy and Bei have an open chat and Bei's session ID is known to Roy
- **WHEN** Bei changes presence to "invisible"
- **THEN** Bei disappears from Roy's presence snapshot while direct messages between their connected sessions remain valid

### Requirement: Disconnect cleanup and reconnect

The server SHALL remove a user immediately when the joined socket disconnects and SHALL broadcast new snapshots. The frontend SHALL use Socket.IO automatic reconnection and submit a new join with the prior nickname and selected presence after reconnecting. A rejected rejoin SHALL return the application to the login form with the rejection message.

#### Scenario: Connected user disconnects

- **GIVEN** Roy's snapshot contains Bei
- **WHEN** Bei's socket disconnects
- **THEN** the server releases Bei's normalized nickname and Roy's next snapshot does not contain Bei

#### Scenario: Client reconnects successfully

- **GIVEN** Roy was joined before a transport disconnect
- **WHEN** the Socket.IO client reconnects and Roy's nickname is available
- **THEN** the frontend rejoins Roy and replaces local presence with the new authoritative snapshot

#### Scenario: Client rejoin is rejected

- **WHEN** an automatically reconnecting client receives a failed session join acknowledgment
- **THEN** the frontend stops the joined experience and displays the server error on the login form

### Requirement: Live presence interface

The main messenger SHALL render contacts and the online count from the latest server snapshot rather than mock contact data. It SHALL allow the current user to update presence and a custom status of at most 40 Unicode code points and SHALL surface rejected updates.

#### Scenario: Snapshot replaces displayed users

- **WHEN** the frontend receives a new presence snapshot
- **THEN** the displayed live-user list and online count exactly reflect that snapshot
