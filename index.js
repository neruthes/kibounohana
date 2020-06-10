// Copyright (c) 2020 Neruthes <https://neruthes.xyz>. All rights reserved.
// GitHub: https://github.com/neruthes/kibounohana
// NPM: kibounohana

const kibounohana = {};
kibounohana.config = {
    lsns: '5df39ca5c5f84159bdf46716c4bdf6ae::', // LocalStorage Namespace
    game: null,
    displayTarget: null,
    deploymentTarget: 'http://localhost:8000' // Without trailing slash
};
kibounohana.RAM = {
    initialScene: 's0',
    currentScene: 's0',
    currentDialogueProgress: 0,
    scenesHistory: []
};
kibounohana.Data = {};
kibounohana.Action = {};
kibounohana.View = {};
kibounohana.Initd = {};

// Misc
kibounohana.assetUrl = function (arg1) {
    return kibounohana.config.deploymentTarget + '/assets/' + arg1
};

// Data
kibounohana.Data.importRuntimeData = function (jsonText) {
    console.log(`kibounohana.Data.importRuntimeData: Feture unimplemented.`);
};
kibounohana.Data.exportRuntimeData = function () {
    return JSON.stringify(kibounohana.RAM);
};
kibounohana.Data.saveProgressInLocalStorage = function () {
    var jsonText = kibounohana.Data.exportRuntimeData();
    LocalStorage[kibounohana.config.lsns+'v1:gameRuntimeData'] = jsonText;
};
kibounohana.Data.validateRuntimeDataBackup = function (jsonText) {
    try {
        var jsonObj = JSON.parse(jsonText);
        if (
            jsonObj.initialScene.match(/^[a-z]\d+$/) &&
            jsonObj.currentScene.match(/^[a-z]\d+$/) &&
            Object.keys(kibounohana.config.game.scenes).indexOf(jsonObj.initialScene !== -1) &&
            Object.keys(kibounohana.config.game.scenes).indexOf(jsonObj.currentScene !== -1) &&
            scenesHistory instanceof Array
        ) {
            return true;
        }
    } catch (e) {
        return false;
    } finally {
        return false;
    };
};
kibounohana.Data.resumeProgressInLocalStorage = function () {
    var candidateText = localStorage[kibounohana.config.lsns+'v1:gameRuntimeData'];
    if (kibounohana.Data.validateRuntimeDataBackup(candidateText)) {
        kibounohana.Data.importRuntimeData(candidateText);
        return {
            err: 0,
            msg: `Resumed game progress from LocalStorage.`
        };
    } else {
        return {
            err: 1,
            msg: `Cannot resume game progress from LocalStorage.`
        };
    }
};

// Action
kibounohana.Action.didClickChoiceButton = function (targetScene) {
    var targetSceneObj = kibounohana.config.game.scenes[targetScene];
    kibounohana.RAM.currentScene = targetScene;
    kibounohana.RAM.scenesHistory.push(targetScene);
    kibounohana.View.fullRender();
};
kibounohana.Action.didClickNextDialogue = function () {
    var dialogueWindow = document.querySelector('#dialogue-view-inner');
    // Is the current dialogue the last dialogue?
    if (kibounohana.RAM.currentDialogueProgress === kibounohana.config.game.scenes[kibounohana.RAM.currentScene].dialogue.length - 1) {
        if (kibounohana.config.game.scenes[kibounohana.RAM.currentScene].autojump) {
            // Auto jump
            kibounohana.RAM.currentDialogueProgress = 0;
            var targetScene = kibounohana.config.game.scenes[kibounohana.RAM.currentScene].autojump;
            var targetSceneObj = kibounohana.config.game.scenes[targetScene];
            kibounohana.RAM.currentScene = targetScene;
            kibounohana.RAM.scenesHistory.push(targetScene);
            kibounohana.View.fullRender();
        } else {
            // Render choices list
            document.querySelector('.main-view').innerHTML = kibounohana.View.renderChoicesList(kibounohana.config.game.scenes[kibounohana.RAM.currentScene].choices);
        }
    } else {
        // Render next dialogue
        kibounohana.RAM.currentDialogueProgress += 1;
        dialogueWindow.innerHTML = kibounohana.View.renderDialogueWindow(kibounohana.config.game.scenes[kibounohana.RAM.currentScene].dialogue[kibounohana.RAM.currentDialogueProgress]);
    };
};

// View
kibounohana.View.fullRender = function () {
    console.log(`kibounohana.View.fullRender: Started`);
    kibounohana.RAM.currentDialogueProgress = 0;
    var currentSceneObj = kibounohana.config.game.scenes[kibounohana.RAM.currentScene];
    var displayTarget = document.querySelector(kibounohana.config.displayTarget);
    kibounohana.displayTarget = displayTarget;
    var renderingFunction = kibounohana.View[`renderMainView_${currentSceneObj.type}`];
    displayTarget.innerHTML = renderingFunction(currentSceneObj);
};
kibounohana.View.renderMainView_title = function () {
    console.log('Hello world! > title');
    return `<div>
        <style>
        .main-view {
            background: #345 url(${kibounohana.assetUrl('img/main-title-bg.jpg')}) center right no-repeat;
            background-size: cover;
            width: 100%;
            height: ${kibounohana.displayTarget.offsetHeight}px;
            padding: 1px;
        }
        </style>
        <div class="main-view view-type--title">
            <div style="text-align: center;">
                <div>
                    <img src="${kibounohana.assetUrl('img/main-title-title.png')}" style="width: 70%; margin: 12% 0 15px;">
                </div>
                <div style="color: #17F; font-size: 22px; font-weight: 600;">
                    （绝赞内测中）
                </div>
            </div>
            <div style="color: #FFF; text-align: center; text-shadow: rgba(0, 0, 0, 0.6) 0 1px 4px; position: absolute; left: 0px; bottom: 0px; width: 100%; padding: 0 0 25px;">
                <div class="" style="
                    cursor: pointer;
                    font-size: 28px; font-weight: 600; color: #F11; background: #FFF; border-radius: 6px; text-shadow: none;
                    max-width: 240px; padding: 15px 25px; margin: 0 auto 30px;
                " onclick="kibounohana.Action.didClickChoiceButton('s1')"
                >开始游戏</div>
                <a href="./credits.html" style="color: #FFF; text-decoration: none;">制作人员名单与致谢</a>
            </div>
        </div>
    </div>`;
};
kibounohana.View.renderMainView_intro = function () {
    console.log('Hello world! > intro');
    return `<div>
        <style>
        .main-view {
            font-size: 20px;
            color: #FFF;
            line-height: 1.5;
            background: #345 url(${kibounohana.assetUrl('img/intro-1.jpg')}) center right no-repeat;
            background-size: cover;
            width: 100%;
            height: ${kibounohana.displayTarget.offsetHeight}px;
            padding: 1px 20px;
        }
        .main-view p {
            // font-size: 22px;
        }
        </style>
        <div class="main-view view-type--intro">
            <div style="text-align: center;">
                <div>
                    <h1>前情提要</h1>
                    <p>
                        2020 年 XX 月 XX 日。
                    </p>
                    <p>
                        在美国 COVID-19 疫情愈演愈烈之时，在美国留学的徐小明发现，已经买不到回国的机票了。
                    </p>
                    <p>
                        作为玩家的你将要扮演徐小明，找到回国的方法，保护自己的生命健康。
                    </p>
                    <div class="" style="
                        cursor: pointer;
                        font-size: 28px; font-weight: 600; color: #F11; background: #FFF; border-radius: 6px; text-align: center; text-shadow: none;
                        max-width: 240px; padding: 15px 25px; margin: 0 auto 30px;
                    " onclick="kibounohana.Action.didClickChoiceButton('s2')"
                    >踏上旅程</div>
                </div>
            </div>
            <div style="
                // position: absolute;
                // left: 0px;
                // bottom: 50px;
                // width: 100%;
            ">

            </div>
        </div>
    </div>`;
};
kibounohana.View.renderMainView_basic = function (currentSceneObj) {
    console.log('Hello world! > basic');
    console.log('currentSceneObj', currentSceneObj);
    return `<div>
        <style>
        .main-view {
            font-size: 22px;
            color: #FFF;
            line-height: 1.6;
            background: #345 url(${kibounohana.assetUrl('img/intro-1.jpg')}) center right no-repeat;
            background-size: cover;
            width: 100%;
            height: ${kibounohana.displayTarget.offsetHeight}px;
            padding: 1px 20px;
        }
        .main-view p {
            // font-size: 22px;
        }
        .choice-button {
            cursor: pointer;
            font-size: 28px; font-weight: 600; color: #F11; background: #FFF;
            text-align: center; text-shadow: none;
            border-radius: 6px;
            max-width: 240px; padding: 15px 25px; margin: 0 auto 30px;
        }
        </style>
        <div class="main-view view-type--basic">
            <div class="dialogue-manager" onclick="kibounohana.Action.didClickNextDialogue()" style="height: ${kibounohana.displayTarget.offsetHeight}px;">
                <div class="dialogue-view">
                    <div id="dialogue-view-inner">
                        ${kibounohana.View.renderDialogueWindow(currentSceneObj.dialogue[kibounohana.RAM.currentDialogueProgress])}
                    </div>
                </div>
            </div>
        </div>
    </div>`;
};
kibounohana.View.renderMainView_final = function () {
    console.log('Hello world! > final');
};
kibounohana.View.renderDialogueWindow = function (dialogueObj) {
    console.log(dialogueObj);
    return `<div>
        <style>
        .main-view .dialogue-window {
            position: absolute;
            left: 0px;
            bottom: 10px;
            width: 100%;
            padding: 10px;
        }
        .main-view .dialogue-window-inner {
            background: rgba(0, 0, 0, 0.4);
            border: 2px solid #17F;
            padding: 0px;
        }
        .main-view .dialogue-window .dialogue-char {
            color: #FFF;
            background: #17F;
            padding: 15px;
        }
        .main-view .dialogue-window .dialogue-text {
            padding: 15px;
            min-height: 300px;
        }
        </style>
        <div class="dialogue-window">
            <div class="dialogue-window-inner">
                <div class="dialogue-char">
                    ${dialogueObj.char}
                </div>
                <div class="dialogue-text">
                    ${dialogueObj.text}
                </div>
            </div>
        </div>
    </div>`;
};
kibounohana.View.renderChoicesList = function (choicesList) {
    return `<div>
        <style>
        .main-view .choices-list {
            position: absolute;
            top: 60%;
            left: 50%;
            width: 300px;
            height: 400px;
            transform: translate(-50%, -50%);
        }
        .main-view .choices-list .choice-item {
            cursor: pointer;
            font-size: 28px; font-weight: 600; color: #07F; background: #FFF; border-radius: 6px; text-align: center;
            text-shadow: none; box-shadow: rgba(0, 0, 0, 0.5) 0 2px 12px 1px;
            width: 100%; padding: 15px 25px; margin: 0 auto 30px;
        }
        </style>
        <div class="choices-list">
            ${
                choicesList.map(function (choiceObj) {
                    return `<div class="choice-item" onclick="kibounohana.Action.didClickChoiceButton('${choiceObj.jump}')">
                        ${ choiceObj.label }
                    </div>`;
                }).join('')
            }
        </div>
    </div>`;
};

// Initd
kibounohana.Initd.boot = function (gameDesignDataObj, displayTarget) {
    kibounohana.config.game = gameDesignDataObj;
    kibounohana.config.displayTarget = displayTarget;
    // kibounohana.Data.resumeProgressInLocalStorage();
    kibounohana.View.fullRender();
};
