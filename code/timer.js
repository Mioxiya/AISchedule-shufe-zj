/**
 * 时间配置函数，此为入口函数，不要改动函数名
 */
async function scheduleTimer({} = {}) {
    // 财政统一作息
    let result = {
        totalWeek: 20, // 总周数：[1, 30]之间的整数
        startSemester: '', // 开学时间：时间戳，13位长度字符串，推荐用代码生成
        startWithSunday: false, // 是否是周日为起始日，该选项为true时，会开启显示周末选项
        showWeekend: false, // 是否显示周末
        forenoon: 5, // 上午课程节数：[1, 10]之间的整数
        afternoon: 4, // 下午课程节数：[0, 10]之间的整数
        night: 4, // 晚间课程节数：[0, 10]之间的整数
        sections: [], // 课程时间表，注意：总长度要和上边配置的节数加和对齐
    }

    // 辅助函数：计算时间偏移
    function addMinutes(time, minutes) {
        const [hour, minute] = time.split(':').map(Number);
        const date = new Date(0, 0, 0, hour, minute);
        date.setMinutes(date.getMinutes() + minutes);
        return date.toTimeString().slice(0, 5);
    }

    // 生成 sections
    function generateSections() {
        const sections = [];
        let currentTime = "08:00";
        let classDuration = 40
        let breakDuration = 10

        function pushNClass(n, startSection) {
            for (let i = startSection; i < startSection + n; i++) {
                const endTime = addMinutes(currentTime, classDuration);
                sections.push({
                    section: i,
                    startTime: currentTime,
                    endTime
                });
                currentTime = addMinutes(endTime, breakDuration);
            }
        }
        currentTime = "08:00";// 上午
        pushNClass(5,1);
        currentTime = "14:00";// 下午
        pushNClass(4,6)
        currentTime = "18:30";// 晚上
        pushNClass(4,10)

        return sections;
    }

    result.sections = generateSections();


    return result
}