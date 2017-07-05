define(['jquery'], function ($) {
    
    // 阳历月度的天数。
    var SOLAR_MONTH_SIZE = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],  
        // 农历信息。
        LUNAR_INFO = [0x4bd8, 0x4ae0, 0xa570, 0x54d5, 0xd260, 0xd950, 0x5554, 0x56af, 0x9ad0, 0x55d2, 0x4ae0, 0xa5b6, 0xa4d0, 0xd250, 0xd255, 0xb54f, 0xd6a0, 0xada2, 0x95b0, 0x4977, 0x497f, 0xa4b0,
            0xb4b5, 0x6a50, 0x6d40, 0xab54, 0x2b6f, 0x9570, 0x52f2, 0x4970, 0x6566, 0xd4a0, 0xea50, 0x6a95, 0x5adf, 0x2b60, 0x86e3, 0x92ef, 0xc8d7, 0xc95f, 0xd4a0, 0xd8a6, 0xb55f, 0x56a0, 0xa5b4,
            0x25df, 0x92d0, 0xd2b2, 0xa950, 0xb557, 0x6ca0, 0xb550, 0x5355, 0x4daf, 0xa5b0, 0x4573, 0x52bf, 0xa9a8, 0xe950, 0x6aa0, 0xaea6, 0xab50, 0x4b60, 0xaae4, 0xa570, 0x5260, 0xf263, 0xd950,
            0x5b57, 0x56a0, 0x96d0, 0x4dd5, 0x4ad0, 0xa4d0, 0xd4d4, 0xd250, 0xd558, 0xb540, 0xb6a0, 0x95a6, 0x95bf, 0x49b0, 0xa974, 0xa4b0, 0xb27a, 0x6a50, 0x6d40, 0xaf46, 0xab60, 0x9570, 0x4af5,
            0x4970, 0x64b0, 0x74a3, 0xea50, 0x6b58, 0x5ac0, 0xab60, 0x96d5, 0x92e0, 0xc960, 0xd954, 0xd4a0, 0xda50, 0x7552, 0x56a0, 0xabb7, 0x25d0, 0x92d0, 0xcab5, 0xa950, 0xb4a0, 0xbaa4, 0xad50,
            0x55d9, 0x4ba0, 0xa5b0, 0x5176, 0x52bf, 0xa930, 0x7954, 0x6aa0, 0xad50, 0x5b52, 0x4b60, 0xa6e6, 0xa4e0, 0xd260, 0xea65, 0xd530, 0x5aa0, 0x76a3, 0x96d0, 0x4afb, 0x4ad0, 0xa4d0, 0xd0b6,
            0xd25f, 0xd520, 0xdd45, 0xb5a0, 0x56d0, 0x55b2, 0x49b0, 0xa577, 0xa4b0, 0xaa50, 0xb255, 0x6d2f, 0xada0, 0x4b63, 0x937f, 0x49f8, 0x4970, 0x64b0, 0x68a6, 0xea5f, 0x6b20, 0xa6c4, 0xaaef,
            0x92e0, 0xd2e3, 0xc960, 0xd557, 0xd4a0, 0xda50, 0x5d55, 0x56a0, 0xa6d0, 0x55d4, 0x52d0, 0xa9b8, 0xa950, 0xb4a0, 0xb6a6, 0xad50, 0x55a0, 0xaba4, 0xa5b0, 0x52b0, 0xb273, 0x6930, 0x7337,
            0x6aa0, 0xad50, 0x4b55, 0x4b6f, 0xa570, 0x54e4, 0xd260, 0xe968, 0xd520, 0xdaa0, 0x6aa6, 0x56df, 0x4ae0, 0xa9d4, 0xa4d0, 0xd150, 0xf252, 0xd520],
        
        // 常量：天干、地支、生肖。
        TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
        DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'],
        SHENG_XIAO = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'],
        NSTR1 = ['日', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
        NSTR2 = ['初', '十', '廿', '卅'],
        // 节气。
        TERM_NAME = ['小寒', '大寒', '立春', '雨水', '惊蛰', '春分', '清明', '谷雨', '立夏', '小满', '芒种', '夏至', '小暑', '大暑', '立秋', '处暑', '白露', '秋分', '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'],
        TERM_INFO = [0, 21208, 42467, 63836, 85337, 107014, 128867, 150921, 173149, 195551, 218072, 240693, 263343, 285989, 308563, 331033, 353350, 375494, 397447, 419210, 440795, 462224, 483532, 504758];

    /**
    * 获取农历闰月的月份。
    *
    * @params {int} year 年份。
    *
    * @returns 0 -- 没有闰月，(1 -- 12) 月份。
    */
    function getLunarLeapMonth(year) {
        var month = LUNAR_INFO[year - 1900] & 0xf;
        return (month == 0xf ? 0 : month);
    }

    /**
     * 获取农历年中闰月的天数。
     * 
     * @params {int} year 年份。
     * 
     * @returns 闰月的天数。
     */
    function getLunarLeapMonthDays(year) {
        if (getLunarLeapMonth(year))
            return ((LUNAR_INFO[year - 1899] & 0xf) == 0xf ? 30 : 29);
        else
            return 0;
    }

    /**
     * 获取农历年的总天数。
     * 
     * @params {int} year 年份。
     * 
     * @returns 总天数。
     */
    function getLunarYearDays(year) {
        var i, sum = 348;
        for (i = 0x8000; i > 0x8; i >>= 1) {
            sum += (LUNAR_INFO[year - 1900] & i) ? 1 : 0;
        }
        return sum + getLunarLeapMonthDays(year);
    }
    
    /**
     * 返回农历某年某月的总天数。
     * 
     * @params {int} year 年份。
     * @params {int} month 月份。
     * 
     * @returns 总天数。
     */
    function getLunarMonthDays(year, month) {
        return (LUNAR_INFO[year - 1900] & (0x10000 >> month)) ? 30 : 29;
    }

    /**
     * 传入 offset 返回干支, 0 = 甲子。
     */
    function cyclical(num) {
        return TIAN_GAN[num % 10] + DI_ZHI[num % 12];
    }
    
    /**
     * 获取阳历某年某月(以零开始)的天数。
     */
    function getSolarMonthDays(year, month) {
        if (month == 1) {
            return ((year % 4 == 0) && (year % 100 != 0) || (year % 400 == 0)) ? 29 : 28;
        } else {
            return SOLAR_MONTH_SIZE[month];
        }
    }
    
    /**
     * 某年的第n个节气为几日(从0小寒起算)
     */
    function getTerm(year, n) {
        var offDate = new Date((31556925974.7 * (year - 1900) + TERM_INFO[n] * 60000) + Date.UTC(1900, 0, 6, 2, 5));
        return offDate.getUTCDate();
    }

    /**
     * 计算农历。
     * 
     * @params {Date} date 日期。
     * 
     * @returns {year 年 month 月 day 日 isLeap 闰}。
     */
    function lunar(date) {
        var i, leap = 0, temp = 0, result = {};

        // 标准时。
        var offset = (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(1900, 0, 31)) / 86400000;

        for (i = 1900; i < 2100 && offset > 0; i++) {
            temp = getLunarYearDays(i);
            offset -= temp;
        }

        if (offset < 0) {
            offset += temp;
            i--;
        }

        result.year = i;
        leap = getLunarLeapMonth(i); // 闰哪个月
        result.isLeap = false;

        for (i = 1; i < 13 && offset > 0; i++) {
            // 闰月
            if (leap > 0 && i == (leap + 1) && result.isLeap == false) {
                --i;
                result.isLeap = true;
                temp = getLunarLeapMonthDays(result.year);
            } else {
                temp = getLunarMonthDays(result.year, i);
            }

            // 解除闰月
            if (result.isLeap == true && i == (leap + 1)) {
                result.isLeap = false;
            }
            offset -= temp;
        }
        if (offset == 0 && leap > 0 && i == leap + 1)
            if (result.isLeap) {
                result.isLeap = false;
            } else {
                result.isLeap = true;
                --i;
            }
        if (offset < 0) {
            offset += temp;
            --i;
        }
        result.month = i;
        result.day = offset + 1;

        return result;
    }

    return {
        /**
         * 计算日历。
         * 
         * @params {int} year 年份。
         * @params {int} month 月份。
         * 
         * @returns 。
         */
        createCalendar: function (year, month, day) {
            var sDObj, lDObj, lY, lM, lD = 1, lL, lX = 0, tmp1, tmp2;
            var cY, cM, cD; // 年柱, 月柱, 日柱
            var lDPOS = new Array(3), n = 0, firstLM = 0;
            var result = {};

            sDObj = new Date(year, month, 1, 0, 0, 0, 0); // 当月一日日期

            result.length = getSolarMonthDays(year, month); // 公历当月天数
            result.firstWeek = sDObj.getDay(); // 公历当月1日星期几

            // 年柱 1900年立春后为庚子年(60进制36)
            if (month < 2) {
                cY = cyclical(year - 1900 + 36 - 1);
            } else {
                cY = cyclical(year - 1900 + 36);
            }

            var term2 = getTerm(year, 2); // 立春日期
            // 月柱 1900年1月小寒以前为 丙子月(60进制12)
            var firstNode = getTerm(year, month * 2); // 返回当月「节」为几日开始
            cM = cyclical((year - 1900) * 12 + month + 12);

            // 当月一日与 1900/1/1 相差天数
            // 1900/1/1与 1970/1/1 相差25567日, 1900/1/1 日柱为甲戌日(60进制10)
            var dayCyclical = Date.UTC(year, month, 1, 0, 0, 0, 0) / 86400000 + 25567 + 10;
            for (var i = 0; i < result.length; i++) {
                if (lD > lX) {
                    sDObj = new Date(year, month, i + 1); // 当月一日日期
                    lDObj = lunar(sDObj); // 农历
                    lY = lDObj.year; // 农历年
                    lM = lDObj.month; // 农历月
                    lD = lDObj.day; // 农历日
                    lL = lDObj.isLeap; // 农历是否闰月
                    lX = lL ? getLunarLeapMonthDays(lY) : getLunarMonthDays(lY, lM); // 农历当月最后一天
                    if (n == 0) {
                        firstLM = lM;
                    }
                    lDPOS[n++] = i - lD + 1;
                }
                // 依节气调整二月分的年柱, 以立春为界
                if (month == 1 && (i + 1) == term2) {
                    cY = cyclical(year - 1900 + 36);
                }
                // 依节气月柱, 以「节」为界
                if ((i + 1) == firstNode) {
                    cM = cyclical((year - 1900) * 12 + month + 13);
                }
                // 日柱
                cD = cyclical(dayCyclical + i);
                // 
                result[i] = {
                    isToday: false,
                    // 阳历。
                    sYear: year, // 公元年4位数字
                    sMonth: month + 1, // 公元月数字
                    sDay: i + 1, // 公元日数字
                    week: NSTR1[(i + result.firstWeek) % 7], // 星期, 1个中文
                    // 农历。
                    lYear: lY, // 公元年4位数字
                    lMonth: lM, // 农历月数字
                    lDay: lD++, // 农历日数字
                    isLeap: lL, // 是否为农历闰月
                    // 八字 。
                    cYear: cY, // 年柱, 2个中文
                    cMonth: cM, // 月柱, 2个中文
                    cDay: cD, // 日柱, 2个中文
                    // 节日。
                    lunarFestival: '', // 农历节日
                    solarFestival: '', // 公历节日
                    solarTerms: '' // 节气
                };
            }

            // 节气
            tmp1 = getTerm(year, month * 2) - 1;
            tmp2 = getTerm(year, month * 2 + 1) - 1;
            result[tmp1].solarTerms = TERM_NAME[month * 2];
            result[tmp2].solarTerms = TERM_NAME[month * 2 + 1];

            // 今日
            var today = new Date(), tY = today.getFullYear(), tM = today.getMonth(), tD = today.getDate();
            if (year == tY && month == tM) {
                result[tD - 1].isToday = true;
            }

            return result;
        },
        /**
         * 获取农历日期名称。
         * 
         * @param {integer} day 农历日期。
         * 
         * @return {string} 日期名称。
         */
        getLunarDayName: function (day) {
            var name;
            switch (day) {
                case 10:
                    name = '初十';
                    break;
                case 20:
                    name = '二十';
                    break;
                case 30:
                    name = '三十';
                    break;
                default:
                    name = NSTR2[Math.floor(day / 10)] + NSTR1[day % 10];
                    break;
            }
            return name;
        },
        /**
         * 获取年份的生肖名称。
         * 
         * @param {integer} year 农历年份。
         * 
         * @return {string} 生肖名称。
         */
        getLunarShengXian: function (year) {
            return SHENG_XIAO[(year - 4) % 12];
        }
    };
});