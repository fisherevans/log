// Friends' blogs surfaced on /friends. Add an entry per blog. `description` is
// optional - a row renders fine with just name + url.
export interface Friend {
    name: string;
    url: string;
    description?: string;
}

export const FRIENDS: Friend[] = [
    {
        name: 'Felt Trip',
        url: 'https://blog.felttrip.com/',
        description:
            "Maybe one day he'll make a post explaining the name to us. I'd recommend following along to find out.",
    },
];

// "blog.felttrip.com" from "https://blog.felttrip.com/" - the bare host for the
// mono URL label.
export function displayUrl(url: string): string {
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}
