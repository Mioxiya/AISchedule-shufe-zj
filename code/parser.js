function scheduleHtmlParser(p) {
    let json = JSON.parse(p)
    // 已预处理，只需要改一下weeks和sections
    // [{
    //     name: '离散数学',
    //     position: '9-314',
    //     teacher: '韩煜',
    //     weeks: '1-16周',  周数 "1-16周" "1-15周(单)"
    //     day: '5',
    //     sections: '3-4'
    //   }]
    for (const kc of json) {
        // 节次处理
        let [startJC, endJC] = kc["sections"].split("-");
        kc["sections"] = []
        for (let i = startJC; i <= endJC; i++) kc["sections"].push(i);


        // 周数处理
        const regex = /^(\d+)(?:-(\d+))?周(?:\((单|双)\))?$/;
        const match = kc["weeks"].match(regex);
        const startWeek = parseInt(match[1], 10);
        const endWeek = match[2] ? parseInt(match[2], 10) : start;
        const type = match[3];
        kc["weeks"] = []
        for (let i = startWeek; i <= endWeek; i++) {
            if (type === '单' && i % 2 === 0) continue; // 单周：奇数
            if (type === '双' && i % 2 === 1) continue; // 双周：偶数
            kc["weeks"].push(i)
        }
    }
    return json
}