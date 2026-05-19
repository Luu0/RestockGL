export function getPagination(
    page: number,
    limit: number,
    ) {

    limit = Math.min(limit, 50);

    return {
        skip: (page - 1) * limit,
        take: limit,
    };
}