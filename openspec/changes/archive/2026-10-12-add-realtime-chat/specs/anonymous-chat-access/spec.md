## ADDED Requirements

### Requirement: Anonymous login guidance

The login interface SHALL identify the account field as a nickname and SHALL state that no registration is required. The password field SHALL state that any value, including an empty value, is illustrative only and is not recorded or used.

#### Scenario: Login form explains anonymous access

- **WHEN** an unjoined visitor opens the application
- **THEN** the form labels the identity input as nickname and explains that the password has no authentication or storage effect

### Requirement: Password isolation

The frontend SHALL keep the password value inside the login form component and SHALL NOT include a password property in the login callback, Socket.IO handshake, session join event, shared protocol, browser storage, or backend state. Remember-password and automatic-login controls SHALL be removed or disabled.

#### Scenario: Submit an arbitrary password

- **WHEN** a visitor enters nickname "Roy" and password "anything" and submits the form
- **THEN** the session join payload contains nickname "Roy" and the selected initial presence and contains no password value

#### Scenario: Submit an empty password

- **WHEN** a visitor enters a valid nickname, leaves the password empty, and submits the form
- **THEN** login admission is evaluated only from the nickname and initial presence

### Requirement: Unique active nickname

The server SHALL trim a nickname, count Unicode code points, require 1 through 24 code points, and reserve a lowercase normalized key for each joined socket. It SHALL reject another active join using the same normalized key.

#### Scenario: Join with an available nickname

- **WHEN** an unjoined socket submits nickname "Roy" and initial presence "available"
- **THEN** the server returns a successful acknowledgment containing a server-owned session ID and nickname "Roy"

#### Scenario: Reject a case-insensitive duplicate

- **GIVEN** an active session has nickname "Roy"
- **WHEN** another socket submits nickname "roy"
- **THEN** the server returns error code "NICKNAME_TAKEN" and does not join the second socket

#### Scenario: Reject invalid nickname bounds

- **WHEN** a socket submits a whitespace-only nickname or a nickname longer than 24 Unicode code points
- **THEN** the server returns error code "INVALID_NICKNAME" and does not reserve a nickname

### Requirement: Joined-socket authority

The server SHALL associate identity with the joined Socket.IO socket and SHALL reject mutation events from sockets that have not joined. It SHALL derive sender identity from server state rather than client payload data.

#### Scenario: Unjoined socket sends a mutation

- **WHEN** an unjoined socket emits a presence update, direct message, or Buzz event
- **THEN** the server returns error code "NOT_JOINED" and performs no broadcast or state mutation

### Requirement: Ephemeral session storage

The server SHALL keep session identity only in process memory and SHALL clear all anonymous sessions when the process restarts.

#### Scenario: Restart the chat server

- **GIVEN** one or more users are joined
- **WHEN** the backend process restarts
- **THEN** the new process begins with no joined users or reserved nicknames
