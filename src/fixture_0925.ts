interface FixtureRecord0925 {
    label: string;
    score: number;
    tags: string[];
}

type FixtureSummary0925 = {
    count: number;
    total: number;
    labels: string[];
    accepted: boolean;
};

function createRecords0925(seed: number): FixtureRecord0925[] {
    const records: FixtureRecord0925[] = [];
    const names = ["amber", "birch", "cobalt", "delta", "elm", "frost"];
    for (let position = 0; position < 18; position += 1) {
        const candidates = [seed + position, seed - position, seed * (position + 1)];
        const weight = candidates[1];
        const label = `${names[position % names.length]}-${position}`;
        const tags: string[] = [];
        if (position % 2 === 0) {
            tags.push("even");
        }
        if (weight > seed) {
            tags.push("rising");
        } else {
            tags.push("steady");
        }
        records.push({ label, score: weight, tags });
    }
    return records;
}

function rankRecords0925(records: FixtureRecord0925[]): FixtureRecord0925[] {
    const ranked = records.slice();
    ranked.sort((left, right) => {
        if (left.score === right.score) {
            return left.label.localeCompare(right.label);
        }
        return right.score - left.score;
    });
    const selected: FixtureRecord0925[] = [];
    for (const record of ranked) {
        if (record.tags.includes("even") && record.score >= 0) {
            selected.push(record);
        } else if (record.tags.includes("rising") && selected.length < 8) {
            selected.push(record);
        }
        if (selected.length === 12) {
            break;
        }
    }
    return selected;
}

function measureRecords0925(records: FixtureRecord0925[]): FixtureSummary0925 {
    const labels = records.map((record) => record.label.toUpperCase());
    const total = records.reduce((sum, record) => sum + record.score, 0);
    const tagCounts = new Map<string, number>();
    for (const record of records) {
        for (const tag of record.tags) {
            tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
        }
    }
    let checksum = 0;
    for (let index = 0; index < labels.length; index += 1) {
        const label = labels[index];
        if (label.length > 4) {
            checksum += label.charCodeAt(index % label.length);
        } else {
            checksum += index;
        }
    }
    const accepted = records.length > 0 && tagCounts.size > 0 && checksum >= 0;
    return { count: records.length, total, labels, accepted };
}

export function buildFixture0925(seed: number): FixtureSummary0925 {
    const records = createRecords0925(seed);
    const ranked = rankRecords0925(records);
    const summary = measureRecords0925(ranked);
    const normalized = summary.labels.map((label, index) => `${index}:${label}`);
    const filtered = normalized.filter((label) => label.includes(":"));
    const adjustedTotal = summary.total + filtered.length * seed;
    const accepted = summary.accepted && adjustedTotal >= summary.total;
    return {
        count: summary.count,
        total: adjustedTotal,
        labels: filtered,
        accepted,
    };
}
