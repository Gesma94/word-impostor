# word-impostor

## Server

### When WebSocket connection is closed
1. In case the master has left the room
    1. In case it's still connected from other devices, nothing happens, except removing its connection
    2. in case there is no other connection, notifies all the players that the master has left,
        and start a timeout that will lead to the closing of the room.

2. In case a player has left a room
    1. In case it's still connected from other devices, nothing happens, except removing its connection
    2. In case there is no other connection, notifies the master and all the other players

### When WebSocket message is received

#### When master joins a room
1. Add the connection to the master connections
2. Remove, if exists, the remover callback
3. Notifies all players
4. Send back to the master the room details, including its word if it was playing

#### When player joins a room
1. In case the player was already connected from other devices, just add the connection if this new device
2. Otherwise:
    1. notifies all other players and the master that a new player has joined
    2. Add him into the room
3. Sends to the new player connection, the information about the players in the room, and the details
of the current round

#### When a new round starts
1. Pick the player that will be the impostor
2. Compute the words: the secret word and the impostor word.
3. Send to all players the secret word
4. Send to the impostor the impostor word

#### When the master toggles its feature of playing
1. In case the master was not playing, and now is playing:
    1. Marks that he is now playing
    1. Add him to the list of player
    2. Notifies all the other players about a new player
    3. Notifies the master that a new player joined
    4. Notifies all master connection that he is playing

2. In case the master was playing, and now is not:
    1. Marks that he is not playing anymore
    1. Removes him from the list of player
    2. Notifies all the other players that a player is not playing anymore
    3. Notifies the master that a player has left
    4. Notifies all master connection that he's not playing anymore

