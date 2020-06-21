export function priceStr(str) {
    const priceFirst = str.substring(1);
    return priceFirst.substring(0, priceFirst.length - 3);
}

export function priceStrToInt(str) {
    return parseInt(str.replace(',', ''));
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

export function rangeTimeMonthStr(str) {
    const startDateYear = str.substring(1, 5);
    const startDateMonth = str.substring(6, 8);
    const endDateYear = str.substring(12, 16);
    const endDateMonth = str.substring(17, 19);
    return (
        startDateYear +
        '년 ' +
        startDateMonth +
        '월' +
        ' ~ ' +
        endDateYear +
        '년 ' +
        endDateMonth +
        '월'
    );
}

export function timeStr(str) {
    const timeHour = str.substring(0, 2);
    const timeMin = str.substring(3, 5);
    return timeHour + '시 ' + timeMin + '분 ';
}

export function timeStampToDate(str) {
    const dateYear = str.substring(0, 4);
    const dateMonth = str.substring(5, 7);
    const dateDay = str.substring(8, 10);

    return dateYear + '년 ' + dateMonth + '월 ' + dateDay + '일';
}

export function timeStampToDateSimple(str) {
    const dateYear = str.substring(0, 4);
    const dateMonth = str.substring(5, 7);
    const dateDay = str.substring(8, 10);

    return dateYear + '.' + dateMonth + '.' + dateDay;
}

export function endDateStr(str) {
    const dateEndYear = str.substring(12, 16);
    const dateEndMonth = str.substring(17, 19);

    return dateEndYear + '.' + dateEndMonth + '.';
}

export function nextWeekDay(str) {
    const calendar = new Date();
    const date = calendar.getDate();
    const day = calendar.getDay();
    const month = calendar.getMonth() + 1;
    const year = calendar.getFullYear();
    const lastDate = new Date(year, month, 0).getDate();

    const targetDay = convertKorToDayNum(str);

    let targetDate = date;
    let targetMonth = month;
    let targetYear = year;

    let plusDate = targetDay > day ? targetDay - day : Math.abs(day - targetDay) + 7;

    if (date + plusDate > lastDate) {
        targetMonth = targetMonth + 1;
        targetDate = date + plusDate - lastDate;
    } else {
        targetDate = date + plusDate;
    }

    if (targetMonth > 12) {
        targetYear = targetYear + 1;
        targetMonth = targetMonth - 12;
    }

    return {
        year: targetYear,
        month: targetMonth,
        date: targetDate,
        day: targetDay,
    };
}

function convertKorToDayNum(str) {
    switch (str) {
        case '월':
            return 1;
        case '화':
            return 2;
        case '수':
            return 3;
        case '목':
            return 4;
        case '금':
            return 5;
        case '토':
            return 6;
        case '일':
            return 0;
    }
}

export function convertDayToKor(str) {
    switch (str) {
        case 1:
            return '월';
        case 2:
            return '화';
        case 3:
            return '수';
        case 4:
            return '목';
        case 5:
            return '금';
        case 6:
            return '토';
        case 0:
            return '일';
    }
}

export function dateToTime(str) {
    const year = str.substring(0, 4);
    const month = str.substring(5, 7);

    let intMonth = parseInt(month);
    let intYear = parseInt(year);
    if (intMonth > 11) {
        intMonth = 1;
        intYear += 1;
    }

    return new Date(intYear, intMonth, 1).getTime();
}

export function plusSixMonths(str) {
    const year = str.substring(0, 4);
    const month = str.substring(5, 7);

    let intMonth = parseInt(month) + 3;
    let intYear = parseInt(year);
    if (intMonth > 12) {
        intMonth = intMonth - 12;
        intYear += 1;
    }

    return { month: intMonth, year: intYear };
}
