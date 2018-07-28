export function transformYearTerm(yt){
        var time = yt;
        time = time.replace('-sp','03');
        time = time.replace('-su','06');
        time = time.replace('-fa','09');
        time = time.replace('-wi','12');
        return time;
    }

export function sortYearTerm( a, b ){
        let ta,tb;
        ta = parseInt(transformYearTerm(a.yearterm));
        tb = parseInt(transformYearTerm(b.yearterm));
        if (ta>tb)
            return 1;
        if (tb>ta)
            return -1;
        return 0;
    }


