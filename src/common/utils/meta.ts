export function buildMeta(
    total: number,
    page: number,
    limit: number,
    ) {
    return {
        total,
        page,
        lastPage: Math.ceil(total / limit),
    };
}