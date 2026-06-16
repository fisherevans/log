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
        description: '',
    },
];

// "blog.felttrip.com" from "https://blog.felttrip.com/" - the bare host for the
// mono URL label.
export function displayUrl(url: string): string {
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}
