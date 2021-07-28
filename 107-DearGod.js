window.onload = function () {
    const url = "./deargod.json"/*json文件url，本地的就写本地的位置，如果是服务器的就写服务器的路径*/
    const request = new XMLHttpRequest();
    request.open("get", url);/*设置请求方法与路径*/
    request.send(null);/*不发送数据到服务器*/
    request.onload = function () {/*XHR对象获取到返回信息后执行*/
        if (request.status == 200) {/*返回状态为200，即为数据获取成功*/
            personList = JSON.parse(request.responseText);

            // TODO: 加上 LazyLoad 增加效率
            for (let i = 0; i < personList.length; i++) {
                group = stringToUnicode(personList[i][0].group);
                $("#group-nav")[0].innerHTML += `<input type="button" class="button" data-id=${i} value=${group}>`;
                $("#person")[0].innerHTML += `<article class="hide" data-id=${i}></article>`
                for (let j = 0; j < personList[i].length; j++) {
                    img = personList[i][j].img;
                    name = stringToUnicode(personList[i][j].name);
                    title = stringToUnicode(personList[i][j].title)
                    $("#person > article")[i].innerHTML += `
                    <section data-id=${j}>
                        <img class="headshot" src=${img}>
                        <p class="name">${name}</p>
                        <p class="title">${title}</p>
                    </section>
                    `
                }
            }

            // show 初始化
            $("#person > article")[0].classList.remove("hide")
            $("#person > article")[0].classList.add("group-show");

            // 點擊 group 轉換組別
            $("#group-nav > input").click(function () {
                const gId = this.dataset.id;
                $(".group-show")[0].classList.remove("group-show")
                $("article")[gId].classList.remove("hide");
                $("article")[gId].classList.add("group-show");
            })


            // 點擊頭像放大並加上說明
            $("#person > article > section").click(function () {
                const gId = $(".group-show")[0].dataset.id,
                    pId = this.dataset.id,
                    img = personList[gId][pId].img,
                    name = stringToUnicode(personList[gId][pId].name),
                    title = stringToUnicode(personList[gId][pId].title),
                    text = stringToUnicode(personList[gId][pId].text);


                // 資料放進 .intro
                $(".intro")[0].innerHTML += `
                <img class="intro-left" src=${img}>
                <div class="intro-right">
                    <div class="title intro-title">${title}</div>
                    <div class="name intro-name">${name}</div>
                    <p class="intro-text">${text}<p>
                </div>
                `

                // 把 .intro 放進視窗
                $(".intro")[0].classList.remove("hide");
                $(".intro")[0].classList.add("person-show");

            })

            // 把 .intro 藏起來
            $(".intro")[0].addEventListener("click", function () {
                this.classList.remove("person-show");
                this.classList.add("hide");
                // 初始化
                $(".intro")[0].innerHTML = "";
            })


        }
    }
}

function stringToUnicode(stringCode) {
    let start = 0, end = 0, codeId, newWord, tillNotFound = "True";
    // 進入迴圈 沒找到 "\\u" 跳出迴圈
    while (tillNotFound) {
        // 預先判斷有沒有找到文字
        tillNotFound = stringCode.includes("\\u", end);
        // stringCode 找 "\\u" 後面的 codeId
        start = stringCode.indexOf("\\u");
        end = start + "\\u".length + 4;
        codeId = stringCode.slice(start + "\\u".length, end);
        // 有找到 "\\u"；沒有則跳過
        // 轉換成新的文字
        newWord = String.fromCodePoint(parseInt(codeId, 16));
        // stringCode += 前面的字串 + 新的文字 + 後面的字串
        stringCode = stringCode.slice(0, start) + newWord + stringCode.slice(end);
    }
    // 回傳 stringCode
    return stringCode;
}