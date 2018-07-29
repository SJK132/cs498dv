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

export function calcGPA ( data ) {
    let quiltyPoint = data.a * 4 + data.aminus * 3.67 + data.bplus * 3.33
        + data.b * 3 + data.bminus * 2.67 + data.cplus *2.33
        + data.c * 2 + data.cminus * 1.67 + data.dplus * 1.33
        + data.d * 1 + data.dminus * 0.67;
    let total = data.a + data.aminus + data.bplus
        + data.b + data.bminus + data.cplus
        + data.c + data.cminus + data.dplus
        + data.d + data.dminus + data.f;
    return quiltyPoint / total;
}

function appendTerm(A , B){
        var out = A;
        out['a'] += B['a'];
        out['aminus'] += B['aminus'];
        out['aplus'] += B['aplus'];
        out['b'] += B['b'];
        out['bminus'] += B['bminus'];
        out['bplus'] += B['bplus'];
        out['c'] += B['c'];
        out['cminus'] += B['cminus'];
        out['cplus'] += B['cplus'];
        out['d'] += B['d'];
        out['dminus'] += B['dminus'];
        out['dplus'] += B['dplus'];
        out['f'] += B['f'];
        out['m'] = true;

        return out;
    }



export function processGPA(_input,type,val){
        const input = JSON.parse(JSON.stringify(_input));
        var output = [];
        if (type === 'semester'){
            output = input.reduce( ( out, i ) => {
                const l = out;
                var term = l.filter( yt => yt.yearterm === i.yearterm );

                if (val == null || i.instructor ===val){
                    if (term.length === 0) {
                        out.push(i);
                    }
                    else{
                        out = out.filter( yt => yt.yearterm !== i.yearterm );
                        var data = term[0];
                        out.push(appendTerm(data,i));
                    }
                }
                return out;
            }, []);

        }else if (type === 'prof'){
            output = input.reduce( (out, i ) => {
                var prof = out.filter( yt => yt.instructor == i.instructor );

                if (true){
                    if (prof.length === 0) {
                        out.push(i);
                    }
                    else{
                        out = out.filter( yt => yt.instructor !== i.instructor );
                        var data = prof[0];
                        out.push(this.appendTerm(data,i));
                    }
                }
                return out;
            }, []);
        }
        return output;
    }

