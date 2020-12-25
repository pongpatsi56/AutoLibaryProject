exports.subfReplaceToPeso = (paramstr) => {
    return paramstr.replace('\\a', '$a')
        .replace('\\b', '$b')
        .replace('\\c', '$c')
        .replace('\\d', '$d')
        .replace('\\e', '$e')
        .replace('\\f', '$f')
        .replace('\\g', '$g')
        .replace('\\h', '$h')
        .replace('\\i', '$i')
        .replace('\\j', '$j')
        .replace('\\k', '$k')
        .replace('\\l', '$l')
        .replace('\\m', '$m')
        .replace('\\n', '$n')
        .replace('\\o', '$o')
        .replace('\\p', '$p')
        .replace('\\q', '$q')
        .replace('\\r', '$r')
        .replace('\\s', '$s')
        .replace('\\t', '$t')
        .replace('\\u', '$u')
        .replace('\\v', '$v')
        .replace('\\w', '$w')
        .replace('\\x', '$x')
        .replace('\\y', '$y')
        .replace('\\z', '$z')
}
exports.subfReplaceToBlank = (paramstr) => {
    return paramstr.replace('$a', '')
        .replace('$b', '')
        .replace('$c', '')
        .replace('$d', '')
        .replace('$e', '')
        .replace('$f', '')
        .replace('$g', '')
        .replace('$h', '')
        .replace('$i', '')
        .replace('$j', '')
        .replace('$k', '')
        .replace('$l', '')
        .replace('$m', '')
        .replace('$n', '')
        .replace('$o', '')
        .replace('$p', '')
        .replace('$q', '')
        .replace('$r', '')
        .replace('$s', '')
        .replace('$t', '')
        .replace('$u', '')
        .replace('$v', '')
        .replace('$w', '')
        .replace('$x', '')
        .replace('$y', '')
        .replace('$z', '')
}
exports.subfloopToObject = (paramstr) => {
    if (paramstr.indexOf('$') != -1) {
        const subf = paramstr.split('$');
        const obj = {};
        subf.forEach(element => {
            Object.assign(obj, { ['$' + element.substring(element.lenght, 1)]: element.substring(1, element.lenght) })
        });
        delete obj['$']
        return obj;
    } else {
        return paramstr;
    }
}