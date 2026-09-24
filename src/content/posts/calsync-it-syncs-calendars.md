---
title: 'calsync: It syncs calendars'
date: 2026-06-12
description: A small tool that keeps my work and personal calendars in sync in both directions - personal life blocks off my work day, and my work day shows up on my phone.
tags:
  - tools
  - work
hasVideo: false
draft: true
id: InTq4USBbA
---
Before the COVID shut down, I really didn't worry about accessing my work calendar while at home. I was just at work, from 9 to 5, Monday through Friday. I even left my laptop at work back then...

But now that I work remotely and have kids, organizing my time has become much trickier. Family and personal events started impacting my work day a lot more. My life is spread accross a few different calendars:

- Personal
- Household
- Lisa's *(for awareness)*
- Work Meetings *(work account)*
- On Call *(work account)*

The hard part is that they cross work/life boundaries. A kid's dentist appointment on Household calendar doesn't automatically block my time in my work calendar. And my wife can't see when my meetings are when making plans that include me.

A few years ago, I wrote a [little Google Apps Script](/posts/2024/03/18/personal-calendar-sync/) to copy my personal appointments onto my work calendar as "busy" blocks. It worked, but it only solved half of the problem I actually have. So I wrote a second, similar script to go the other way with slightly different features.

Well, someone asked about it and I was embarrassed by the state of it. So I merged the two into a single script with a unified config block. I made: [calsync](https://github.com/fisherevans/calsync).

The whole thing comes down to the wall between my work life and my personal life. Work lives in one Google account, my personal and shared calendars live in another, and getting them to cooperate across that wall - without handing either side access it shouldn't have - is the entire problem. There are really two halves to it.

**I want to see my work calendar without giving work my personal devices.** I want my meetings on my phone, and I want Lisa to see when I'm busy so she can plan around it. The options for that all stink: live in the Slack calendar app, or log my work account into my personal phone and laptop and let work plant a foot on my devices. I don't want either. I just want to know what time my 2pm is.

**I want my personal life to block off my work day.** Dentist, haircut, God forbid an interview - these happen between 9 and 5, and if they only exist on my personal calendar, a coworker will book a meeting right over them. And the calendar slot undersells the real cost. "Dentist, 2:00-2:30" ignores the drive there and back, the context switch, and the few minutes it takes to land and catch up on whatever happened in Slack while I was gone.

calsync handles both with a handful of small, boring moves. Here are the ones that matter.

## Mask: show that you're busy, without the details

The first move is the one the old script did. Take an event from a personal calendar and drop a copy onto my work calendar as an opaque block. Same time slot, but the title and notes are gone - coworkers see "Busy," not "Dentist - Dr. Alvarez."

![Mask: a personal event becomes an opaque "Busy" block on the work calendar](/posts/calsync/demo-mask.svg)

Nobody books over it, and nobody learns anything about my afternoon.

## Buffer: pad the block

A 2:30 appointment isn't really over at 2:30. I have to get there, get back, and get my head back into work. So the busy block gets padded on both ends by a buffer. The half-hour haircut becomes a wider hold on my work calendar, and the meeting that would have landed at 3:01 lands somewhere I can actually make it to.

![Buffer: the busy block is padded past the appointment on both ends](/posts/calsync/demo-buffer.svg)

## Mirror: see my work day on my own calendar

The other direction, and the half the old script never did. Take my work meetings and copy them onto a personal calendar - but just the title. No guest list, no attached docs, no meeting notes. Enough to see the shape of my day on my phone, with none of the work content riding along where it shouldn't.

![Mirror: a work meeting copied to the personal calendar as title only](/posts/calsync/demo-mirror.svg)

This is the half that lets Lisa glance at her calendar and see I'm in a meeting from 10 to 11, without either of us logging into my work account.

## Extras: carry the two things I actually reach for

The title is usually enough, but two details are worth carrying over, and each is its own switch.

The **join link**, for when I'm running late and need to drop into a Zoom from my phone while walking to the car - no laptop, no digging through email.

The **room**, for when I'm on-site and have no idea where "Project Review" actually is. I want to glance at my phone and see "Banana, 4th floor," not pull out my laptop to find it.

![Extras: the room and join link carried onto the personal calendar](/posts/calsync/demo-extras.svg)

## Where this came from

The first script came out of the second problem - I was tired of meetings landing on top of personal appointments. Then the first problem crept up on me, so I wrote a *second* script going the other way for the join links and the visibility. Two scripts, two configs, two things to babysit.

calsync is just those two merged. It turns out "block off my work day" and "show me my work day" are the same operation pointed in opposite directions - copy events from one calendar into another and keep them in sync. So it's one engine, and the difference between mask and mirror is a few lines of config. You say which calendars feed which, which mode, and what to carry; it does the rest on a schedule.

I'll be upfront: there's nothing clever under the hood here. It's a small tool doing a boring job, and most of the work was deciding what it *shouldn't* copy. But it's the kind of boring that quietly saves me a dozen tiny annoyances a week. That was true right up until it started making duplicates of everything, which is further down.

## Quick setup

It's a Google Apps Script, so there's no server to babysit - it lives in your Google account and fires whenever a calendar changes. Setup is mostly wiring:

1. Share the calendars you want to sync into the account the script runs as - read on the sources, write on the targets.
2. Clone the repo, `npm install`, and copy the template: `cp Config.example.js src/Config.js`.
3. Edit `src/Config.js` (below) with your calendars and rules.
4. `npx clasp login`, `npx clasp create --type standalone --rootDir src`, then `npx clasp push` to send it up.
5. In the Apps Script editor, run `dryRunAll` to preview, `syncAll` to do it for real, and `setupTriggers` once to keep it running on its own.

The config is the whole interface. You name your calendars once, then write rules against those names. Here's roughly what mine looks like:

```javascript
// Name the calendars once; rules reference these names.
const CALENDARS = {
  work: 'primary',                       // the account calsync runs as
  personal: 'fisher@gmail.com',          // shared into the work account
  family: 'family-abc123@group.calendar.google.com',
  phone: 'workview-def456@group.calendar.google.com', // a calendar I read on my phone
};

function getSyncRules() {
  return [
    // Personal life -> work, as opaque "busy" blocks padded for travel.
    {
      name: 'personal_to_work',
      mode: 'mask',
      sources: ['personal', 'family'],
      target: 'work',
      maskTitle: 'Busy',
      bufferMinutes: 20,                  // a 2:00-2:30 appt holds 1:40-2:50
      color: CalendarApp.EventColor.YELLOW,
      visibility: CalendarApp.Visibility.PRIVATE,
      includeWeekends: false,
      excludeTitles: ['[free]'],          // skip personal events tagged [free]
    },

    // Work day -> a calendar I read on my phone: titles, room, and join link.
    {
      name: 'work_to_phone',
      mode: 'mirror',
      sources: ['work'],
      target: 'phone',
      copyLocation: true,                 // carry the room
      extractUrlRegex: 'company\\.zoom\\.us', // carry a matching join link
      excludeTitles: ['Busy'],            // don't mirror my own mask blocks back
    },
  ];
}
```

The mask rule is the one I lean on most. `bufferMinutes` is the travel-and-context-switch pad, `maskTitle` and `visibility` are what keep the details off my work calendar, and `excludeTitles` lets me opt a personal event out by tagging it `[free]`. Everything not set falls back to sensible defaults, so a rule only has to say what's interesting about it.

## Since June: it was making duplicates

A few months of running on its own and my calendars filled up with copies. Not evenly. Most events were fine, plenty had two or three, and one slot had 87 copies of the same event stacked on top of each other. A cleanup script I wrote later counted 338 duplicates across 47 distinct event shapes.

The first real clue was a screenshot, not the code. Mask events get created yellow. In one of the piles, the copies alternated yellow and blue, and blue is Google's default. Some of those copies had never had `setColor` applied to them, which means they were made by a run that didn't finish.

That pointed at the create path, which wrapped the whole creation sequence in one retry:

```javascript
return withRetry_(() => {
  const ev = target.createEvent(d.title, d.start, d.end); // not idempotent
  ev.setTag(tagKey, tagValue);
  if (d.color) ev.setColor(d.color);
  if (d.visibility) ev.setVisibility(d.visibility);
  return ev;
});
```

`withRetry_` re-runs the whole closure, up to four attempts. It's there because the Calendar service throws transient errors under load. But `createEvent` isn't idempotent. If the event got created and then a setter threw, the retry started over from the top and created a second event. The first one was already on the calendar and nothing ever deleted it. One call could leave up to three orphans behind.

I thought that was the whole story, and I was wrong for a day. The cleanup sweep reported groups of 8, 13, 18 events that all carried the script's tag, and a tagged event means the create sequence got at least as far as the tag call. So I decided the tag values must be drifting between runs, probably on recurring events, where the API hands back one ID for a whole series. That was a deduction from an assumption. I hadn't measured anything.

Measuring took one read-only pass: print every stored tag in the worst groups, and print the keys the engine computes for the live source events right now. Distinct tag values per group: 1. Eighteen events, one key, every one of them matching a live source exactly. The keys had never drifted. The retry bug was the whole story, and it produced two flavors of duplicate depending on where the failure landed - before the tag, leaving an untagged orphan, or after it, leaving a duplicate with an identical tag.

Which raises the better question: why was a bad retry from June still sitting there in September? Because of the second bug. The reconciler indexes the events it manages by that tag:

```javascript
if (v) managed.set(v, ev); // 18 events, one key: 17 vanish
```

`Map.set` overwrites. Eighteen copies go in, one comes out, and the other seventeen stop existing as far as the reconciler is concerned. It diffed the survivor, called it unchanged, and the pass that deletes orphans walked the same map, so it never saw them either. The reconciler had no way to represent "more than one match," so it could never converge. It couldn't heal this no matter how many times it ran.

Three fixes went in.

**Give each call its own retry, and write the identity first.** Create, then tag, then everything else, each wrapped separately. The ordering is the point: a tagged event that's half-shaped is findable, so the next run's diff repairs it, while an untagged one is garbage forever. There's still a window - if `createEvent` itself times out after Google created the event, the retry duplicates it anyway. Closing that needs a lookup before the create.

**Bucket, then collapse.** Index into arrays instead of overwriting, keep the first event under each key, delete the rest. Now a duplicate is something the reconciler recognizes and removes on its own.

**A one-off sweep for the backlog**, because the sync window only looks forward from now, and the old copies had drifted into the past where the reconciler will never reach them again. It runs two passes with deliberately different confidence. Exact: same tag value, same source instance by construction, keep one and delete the rest. Inferred: an untagged event with the same title, start and end as a tagged sibling. Requiring that tagged sibling is the evidence the copy came from this script and not from me.

All of that is deployed, not verified. The fixed code has been running for about ten days and I haven't run the dry run that would prove the counts actually reach zero.

Three things I'd carry somewhere else:

- Never put a non-idempotent operation inside a retry that re-runs a whole sequence. Retry the smallest unit that can fail.
- Write the identity before the decoration. Ordering inside a create is a durability decision, not a style preference.
- `map.set(key, value)` in an index is an assertion that keys are unique. If a collision is possible, that's a silent data-loss bug with a friendly face.

## Worth it?

\[TODO: short honest wrap - has it actually held up day to day, does Lisa use it, anything still rough.\] Okay.

If you want to run your own, setup and the full list of knobs are in the [README](https://github.com/fisherevans/calsync).
