// Build-time fetch of the projects.fisher.sh catalog, for rendering inline
// project cards in blog posts. Drop this into the log repo (e.g. src/lib/) and
// import it from ProjectCard.astro.
//
// The fetch is memoized for the build so N cards on a page hit the network once.
// If projects.fisher.sh is unreachable at build time, this returns an empty map
// and ProjectCard renders a plain text link fallback rather than failing the build.

export interface ProjectSummary {
    slug: string;
    name: string;
    tagline: string;
    summary: string;
    tech: string[];
    status: 'active' | 'experiment' | 'archived';
    year: number | string | null;
    url: string;
    repo: string | null;
    thumbnail: string | null;
}

const SOURCE = 'https://projects.fisher.sh/projects.json';

let cache: Map<string, ProjectSummary> | null = null;

export async function getProjects(): Promise<Map<string, ProjectSummary>> {
    if (cache) return cache;
    const map = new Map<string, ProjectSummary>();
    try {
        const res = await fetch(SOURCE);
        if (res.ok) {
            const data = (await res.json()) as { projects: ProjectSummary[] };
            for (const p of data.projects) map.set(p.slug, p);
        } else {
            console.warn(`[projects] ${SOURCE} returned ${res.status}; cards will fall back.`);
        }
    } catch (err) {
        console.warn(`[projects] could not fetch ${SOURCE}; cards will fall back.`, err);
    }
    cache = map;
    return map;
}

export async function getProject(slug: string): Promise<ProjectSummary | undefined> {
    return (await getProjects()).get(slug);
}
