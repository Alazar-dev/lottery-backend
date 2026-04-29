export const getCurrentWeek = (): string => {
    const now = new Date();

    const firstDay = new Date(now.getFullYear(), 0, 1);

    const days = Math.floor(
        (now.getTime() - firstDay.getTime()) / 86400000
    );

    const week = Math.ceil((days + firstDay.getDay() + 1) / 7);

    return `${now.getFullYear()}-W${week}`;
};