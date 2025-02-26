async function scheduleHtmlProvider() {
    await loadTool('AIScheduleTools')
    // 登录后有可能定向到内网或webVPN，需要做处理防止同源策略拒绝访问
    let origin
    if (window.location.origin.indexOf("webvpn.shufe-zj.edu.cn") === -1) {
        console.log("内网访问")
        // 内网
        origin = "https://jwxt.shufe-zj.edu.cn"
    } else {
        console.log("外网访问")
        // webVPN
        origin = "https://webvpn.shufe-zj.edu.cn/https/77726476706e69737468656265737421fae0598869236045780dc4b6921b263199db675f"
    }

    // 使用Fetch请求教务的接口
    let url;
    try {
        try {
            const response = await fetch(origin + "/kbcx/xskbcx_cxXskbcxIndex.html?gnmkdm=N2151");
            const html = await response.text();

            // 把 HTML 字符串转成 DOM
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // 精准获取选中的年份和学期
            const selectedYear = doc.querySelector('option[selected="selected"][value]').value;
            const selectedTerm = doc.querySelectorAll('option[selected="selected"]')[1].value;

            console.log('Selected Year:', selectedYear);
            console.log('Selected Term:', selectedTerm);
        } catch (error) {
            console.error(error)
            await AIScheduleAlert(error.message)
            return 'do not continue'
        }

        url = origin + "/kbcx/xskbcx_cxXsgrkb.html?gnmkdm=N2151"
        const res = await fetch(url, {
            headers: {
                "content-type": "application/x-www-form-urlencoded;charset=UTF-8"
            }, "body": "xnm=2024&xqm=12&kzlx=ck&xsdm=", "method": "POST"
        });

        let json = await res.json()
        let result = []

        let classList = json["kbList"];
        for (const i of classList) {
            result.push({
                name: i["kcmc"], // 课程名称
                position: i["cdmc"], // 上课地点
                teacher: i["xm"], // 教师名称
                weeks: i["zcd"], // 周数 "1-16周" "1-15周(单)"
                day: i["xqj"], // 星期
                sections: i["jcs"], // 节次 "3-4"
            })
        }
        console.log(result)
        return JSON.stringify(result)
    } catch (error) {
        console.error(error)
        await AIScheduleAlert(error.message)
        return 'do not continue' // 阻止继续
    }
}