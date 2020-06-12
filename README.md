# Kibounohana (希望の花)

## Introduction

Web-based AVG engine.

## Usage

### Include Kibounohana JS File

```
yarn add kibounohana
```

```html
<script src="./node_modules/kibounohana/index.js"></script>
```

### Write Your Story

See [neruthes/kibounohana-demo](https://github.com/neruthes/kibounohana-demo) for demo and here is the [online demo](https://neruthes.xyz/kibounohana-demo/).

Sample story:

```javascript
const myGame = {};
myGame.scenes = {
    s0: {
        type: 'basic',
        dialogue: [
            { char: 'Alice', bg: '1.png', text: 'Hey, Bob!' },
            { char: 'Bob', bg: '2.png', text: 'How are you, Alice!' }
        ],
        choices: [
            { label: 'Start Over', jump: 's0' }
        ]
    }
};
```

### Boot The game

```javascript
kibounohana.Initd.boot(myGame, '#displayTarget');
```

This method accept 2 arguments:

Argument        | Description
--------------- | -----------
arg1            | Game story object.
arg2            | CSS selector string for the display target.

### Notice These As Well

- Set `kibounohana.config.deploymentTarget` to un string like `http://localhost:8000`.
- Background images for dialogues should be placed in `/assets/img/`.
- You can define your own scene types (eg `mySceneType`) by setting `kibounohana.View.renderMainView_mySceneType` as un function which accept `currentSceneObj` as `arguments[0]`.


## Copyright

Copyright (c) 2020 Neruthes.

Published under GNU AGPL v3.
