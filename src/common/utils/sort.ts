export function buildSort(
    field: string,
    direction: 'asc' | 'desc' = 'asc',
    ) {
    return {
        [field]: direction,
    };
}