# Customization of the Overlay

## Events
Each data object that is sent over the websocket is an object of this type:
```ts
{
    event: string,
    data?: any,
}
```

The different events are

-   championSelectStarted
-   championSelectEnded
-   newPickOrder
-   newState
-   newConfig

### Events List

#### championSelectStarted

This event is sent on the start of the champion selection. No additional data is sent other than the event string.

#### championSelectEnded

This event is sent at the definitve end of the champion selection, when the spectator leaves the champion selection (after the 3min delay). No additional data is sent other than the event string.

#### newPickOrder

This event is sent, after the last champion is picked, but before any trades happened. Together with the event there is sent the state of the champion selection sent as a bject of type State.

#### newState

This event is sent whenever something happened in the champion selection, this can be anything from a banned champion to a summoner spell change or just an internal state change of the client. Together with the event there is sent the state of the champion selection sent as a bject of type State.

#### newConfig

This is sent once, when the overlay is started and everytime the configs are changed through the web form.
Together with the event, there is sent the current configs as a JSON object



## Data Types

```ts
interface State {
    started: boolean;
    bluePicks: Array<Pick>;
    redPicks: Array<Pick>;
    blueBans: Array<Ban>;
    redBans: Array<Ban>;
    time: number;
    timestamp: number;
    actingSide: string;
    phase: string;
}

interface Pick {
    championId: number;
    isCompleted: boolean;
    isPicking: boolean;
    spellId1: number;
    spellId2: number;
    summonerName: string;
}
interface Ban {
    championId: number;
    isActive: boolean;
    isCompleted: boolean;
}

interface config{
    [key:string]: string;
}
```






