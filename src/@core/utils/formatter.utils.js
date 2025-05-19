import moment from 'moment-jalaali'

export function pirceFormatter(price) {
    return Number(price).toLocaleString('fa-IR')
}
export function convertGrigorianDateToJalaali(grigorianDate) {
    moment.loadPersian({usePersianDigits: true})
    return moment(grigorianDate).format('jD jMMMM jYYYY')
}
export function convertGrigorianDateToJalaali2(grigorianDate) {
    moment.loadPersian({usePersianDigits: true})
    return moment(grigorianDate).format('jYYYY/jMM/jDD')
}
export function convertGrigorianDateToJalaali3(grigorianDate) {
    moment.loadPersian()
    return moment(grigorianDate).format('jYYYY-jMM-jDD')
}
export function convertPersianDateToGerigorian(persianDate) {
    moment.loadPersian()
    return moment(persianDate, 'jYYYY/jMM/jDD').format('YYYY-MM-DD')
}
export function convertPersianDateToGerigorian2(persianDate) {
    moment.loadPersian()
    return moment(persianDate, 'jYYYY-jMM-jDD').format('YYYY-MM-DD')
}
export function isValidUrl(string) {
    try {
        const url = new URL(string) // This will throw an error if it's not a valid URL
        return url.protocol === 'http:' || url.protocol === 'https:' // Checks for HTTP/HTTPS
    } catch (_) {
        return false
    }
}
