export function priceStr(str) {
    const priceFirst = str.substring(1);
    return priceFirst.substring(0, priceFirst.length - 3);
}

export function rangeDateStr(str) {
    const dateStartYear = str.substring(1, 5);
    const dateStartMonth = str.substring(6, 8);
    const dateStartDay = str.substring(9, 11);
    const dateEndYear = str.substring(12, 16);
    const dateEndMonth = str.substring(17, 19);
    const dateEndDay = str.substring(20, 22);

    return (
        dateStartYear +
        '년 ' +
        dateStartMonth +
        '월 ' +
        dateStartDay +
        '일 ' +
        '~ ' +
        dateEndYear +
        '년 ' +
        dateEndMonth +
        '월 ' +
        dateEndDay +
        '일'
    );
}

export function oneTimeDateStr(str) {
    const oneDateYear = str.substring(0, 4);
    const oneDateMonth = str.substring(5, 7);
    const oneDateDay = str.substring(8, 10);
    return oneDateYear + '년 ' + oneDateMonth + '월 ' + oneDateDay + '일';
}

export function oneTimeMonthStr(str) {
    const oneDateYear = str.substring(0, 4);
    const oneDateMonth = str.substring(5, 7);
    return oneDateYear + '년 ' + oneDateMonth + '월';
}

export function timeStr(str) {
    const timeHour = str.substring(0, 2);
    const timeMin = str.substring(3, 5);
    return timeHour + '시 ' + timeMin + '분 ';
}
