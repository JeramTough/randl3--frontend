export default {
    /**
     *
     * @param fmt YYYY-mm-dd HH:MM
     * @param date
     * @returns {*}
     */
    formatDate: function (fmt, date) {

        if (!(date instanceof Date)) {
            date = this.createDate(date);
        }

        let ret;
        const opt = {
            "Y+": date.getFullYear().toString(),        // 年
            "m+": (date.getMonth() + 1).toString(),     // 月
            "d+": date.getDate().toString(),            // 日
            "H+": date.getHours().toString(),           // 时
            "M+": date.getMinutes().toString(),         // 分
            "S+": date.getSeconds().toString()          // 秒
            // 有其他格式化字符需求可以继续添加，必须转化成字符串
        };
        for (let k in opt) {
            ret = new RegExp("(" + k + ")").exec(fmt);
            if (ret) {
                fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
            }
        }
        return fmt;
    }

    ,


    createDate: function (date) {
        var ps = date.split(" ");
        var pd = ps[0].split("-");
        var pt = ps.length > 1 ? ps[1].split(":") : [0, 0, 0];
        return new Date(pd[0], pd[1] - 1, pd[2], pt[0], pt[1], pt[2]);
    }
}

