import dayjs from 'dayjs';

export const isAdmin = (user) => {
    return user && user.email === "a.s.gheorghe3@gmail.com"
}

export const timestampToYear = (timestamp) => {
    return (
        dayjs.unix(timestamp.seconds).format('YYYY')

    )
}

export const timestampToMonth = (timestamp) => {
    return (
        dayjs.unix(timestamp.seconds).format('MMMM')
    )
}

export const timestampToDay = (timestamp) => {
    return (
        dayjs.unix(timestamp.seconds).format('DD')
    )
}

