---
title: "Science vs. Technology"
date: 2015-05-26
description: "A small informal survey on whether people think science or technology is more important to society - and what the responses revealed."
hasVideo: false
draft: true
---
I asked over a hundred people: What's more important to society: Science or Technology?

![Science vs. Technology Banner Image](https://media.fisher.sh/blog/2015/05/26/science-vs-technology/science-vs-technology-banner-image.png)

In my "Science, Technology and Society" course at [**VTC**](http://www.vtc.edu/) we were asked: What is [**Science**](http://en.wikipedia.org/wiki/Science)? What is [**Technology**](http://en.wikipedia.org/wiki/Technology)? And, how are they [**related**](http://en.wikipedia.org/wiki/History_of_science_and_technology)? It was apparent that everyone in the class had different opinions on their meanings and relation. I found the discussion afterwards and the related reading interesting enough that I wanted to find out what other people thought. So, I decided to send a survey around asking people to do as my class did; here are my findings.

All of this was way back in January (of 2015), and I've only recently had the time (just graduated) to put some of the data together.

*Just wanna see the data? Jump to the [**Results**](http://fisherevans.com/blog/post/science-vs-technology#results).*

I compiled all of my data into an MS Excel spreadsheet for those of you who would like to look at it themselves. I will be referencing the difference sheets in this document throughout this post. You can download it: [**here**](http://fisherevans.com/files/posts/science-vs-technology/data.xlsx).

## **The Survey**

The survey I put together aimed to gather some basic information about the surveyee's definition and relation of Science and Technology. It consisted of the following questions:

#### **Describe "Science/Technology" in a few words. (2 Questions)**

The goal of these questions was to find what keywords people used when describing Science or Technology. By gathering the words used describe the terms, we should be able to find a pretty accurate definition via related words and synonyms.

#### **How closely related is "Science" to "Technology"?**

Obviously, there is a distinction between Science and Technology but they do share many similar aspects. They also heavily influence each other blurring the line between them even further. The surveyee was asked to give a rating from 1-10 where 1 is "They're totally different" and 10 is "They're the same thing."

#### **How much does "Science/Technology" directly influence your life? (2 Questions)**

Considering how closely related they both are, I wanted to find out which of the two people were more influenced by. People were asked to rate the influence of both (separately) on a scale of 1-10, where 1 is "It doesn't effect me at all" and 10 is "Science/Technology is large part of my life."

#### **What's more important to the advancement of the human kind?**

This question took the previous one, and abstracted it to the whole of the humankind, instead of the individual.

#### **(Optional) What is your gender?**

This one was just to find the differences in responses based gender. It was optional and not really necessary \- but sometimes it's fun to see the social differences between genders.

### **Like a Virus**

I created this survey with [**Google Forms**](http://www.google.com/forms/about/) and shared it on my [**Facebook**](https://www.facebook.com/fisherevans) asking my friends to fill it out and share it. I was only expecting a handful of responses but within a day my post was "shared" by multiple people, and I had people asking for my findings when I was done. I spent the following days waiting for the results to slow down to a point where I thought I had gotten a good enough sample size. By this time I knew I was going to have to do a full write up due to final scale of this little project.

I released the survey at 9am on Wednesday (1/28/15), and closed submissions at 1pm on Saturday (1/31/15). Over that time I was able to gather 117 responses including 1 double submission and 1 "troll" submission. This left me with 115 unique, valid form responses. Awesome. Time to start doing something with all this data.

![submissions per hour](https://media.fisher.sh/blog/2015/05/26/science-vs-technology/submissions-per-hour.png)

*The rate of form submissions per hour while the survey was open.*

## **Processing the Submissions**

Google Forms dumps all the data collected into a giant Google Spreadsheet. It's a great medium for the submissions but it's difficult to get more intricate statistics from that. To do anything fun with the data I had to restructure it into a more accessible format.

### **The Database**

I decided to store everything in a small database. The 1-10 scale ratings were no big deal to store, but for the Science/Technology keywords I had mold the data a little. The main task was to map words to their "root meaning." For example, the following: explore, explores, exploring, explorers and explored; should be represented as one word, explore. I also had to ignore common, non-descriptive words like the, an or and. (You can see the mappings I chose in the "Keyword Mappings" sheet of the Excel Spreadsheet linked below.)

The final table structure for this database was small, but served it's purpose. It contained a main table, "submissions," that held all the multiple choice answers, a "word" table that stored all the used words and what they mapped to, and a "words" table that associated what words each submission used to describe either category (Science or Technology.)

![](https://media.fisher.sh/blog/2015/05/26/science-vs-technology/image3.png)

*The database schema design.*

## **The Results**

All of these results can be found within the various sheets in this [**MS Excel Spreadsheet**](http://fisherevans.com/files/posts/science-vs-technology/data.xlsx). (That also includes the SQL dump of the tables and the SQL queries used to find the results.)

Overall, about a third of the submissions were male, two thirds were female and a handful of submissions that didn't specify. Keep in mind that due to this, female submissions will look about 50% larger than males in the following charts, making it difficult to visually compare male to female data.

![proportions of male, female and other submissions](https://media.fisher.sh/blog/2015/05/26/science-vs-technology/proportions-of-male-female-and-other-submissions.png)

*The proportions of male, female and other submissions.*

### **Influence**

On average, when asked to rate the personal influence of Science and Technology, people said that science was rated at 7.9 and Technology at 8.5. Though the average was close, the standard deviation is far different between the two. The Science ratings were more evenly distributed in the 6-10 range, where Technology had an overwhelming peak right at 10\.

![personal influence of science](https://media.fisher.sh/blog/2015/05/26/science-vs-technology/personal-influence-of-science.png)

![personal influence of technology](https://media.fisher.sh/blog/2015/05/26/science-vs-technology/personal-influence-of-technology.png)

When rating Technology, the gender distribution was about even, but for Science there is a clear difference. Almost no males rated Science at a 10, where nearly half the female submissions rated it a 10\.

In general though, people considered Technology to be more influential in their lives. When asked which was more important to (the advancement of) the humankind though, Science came out well on top (if we consider "Equal" to be neutral.)

![influence on human kind](https://media.fisher.sh/blog/2015/05/26/science-vs-technology/influence-on-human-kind.png)

### **Keywords**

When processing the term definitions/keywords I originally just counted the number of times a word was used amongst all the submissions and ranked the words in order uses. However, I noticed that someone who offered a longer definition had a stronger influence on the results then someone who gave a more precise response. While a longer response may offer a "better," more detailed definition, this survey was looking for average definition. To accomplish equal representation for each surveyee I weighed the word usage based on the number words used in a surveyee's definition. (If someone used 4 words in their definition, each of there word uses would be counted as 0.25 uses.)

On average, surveyees used 3.5 words to describe each term. But there is also an interesting group of people who used 8 words to define the terms. Here's distribution of words per submission.

![keyword counts per submission](https://media.fisher.sh/blog/2015/05/26/science-vs-technology/keyword-counts-per-submission.png)

#### **Science**

According to the Merriam-Webster dictionary, [**Science**](http://www.merriam-webster.com/dictionary/science) is the "knowledge about or study of the natural world based on facts learned through experiments and observation." The top 5 words used to describe Science were: knowledge, fact, proof, test and explore. At least this little experiment shows that the social definition is pretty close to the technical definition.

![science keywords weighted, sorted by total](https://media.fisher.sh/blog/2015/05/26/science-vs-technology/science-keywords-weighted-sorted-by-total.png)

*Weighted keywords describing Science ordered by overall usage. View the non-weighted version [**here**](http://fisherevans.com/files/posts/science-vs-technology/img/keywords/science/non-weighted/total.png).*

Some interesting things emerge when you rank the words based on gendered usage however. Notice how one gender frequently uses words to describe Science that the other never does. For example, the top Science keyword for males was "understand," very few females used this word. On the flip side, the 2nd most used keyword for Science was "interesting." Not one male used that word in their description. The trend is visible for a lot of the words listed below.

![science keywords weighted, sorted by male](https://media.fisher.sh/blog/2015/05/26/science-vs-technology/science-keywords-weighted-sorted-by-male.png)

*Weighted keywords describing Science ordered by male usage. View the non-weighted version [**here**](http://fisherevans.com/files/posts/science-vs-technology/img/keywords/science/non-weighted/male.png).*

*![science keywords weighted, sorted by female](https://media.fisher.sh/blog/2015/05/26/science-vs-technology/science-keywords-weighted-sorted-by-female.png)*

*Weighted keywords describing Science ordered by female usage. View the non-weighted version [**here**](http://fisherevans.com/files/posts/science-vs-technology/img/keywords/science/non-weighted/female.png).*

#### **Technology**

[**Dictionary.com**](http://dictionary.reference.com/browse/technology) defines Technology as the knoweldge involved with creation and use of technical means, or the application of such knoweldge. I think this survey shows again that the social definition is pretty spot on with some of the top ranking words being: tool, application, science and make.

![technology keywords weighted, sorted by totle](https://media.fisher.sh/blog/2015/05/26/science-vs-technology/technology-keywords-weighted-sorted-by-totle.png)

*Weighted keywords describing Technology ordered by overall usage. View the non-weighted version [**here**](http://fisherevans.com/files/posts/science-vs-technology/img/keywords/technology/non-weighted/total.png).*

Similar to Science, the gender distribution between Technology keywords is pretty interesting. Take a look at the top two keywords: application and tool. Both are dominated by one gender. There are few male dominated words for Technology, but a lot of the top 10 for female keywords were rarely used by males: future, make, life, advance, innovation, etc.

![technology keywords weighted, sorted by male](https://media.fisher.sh/blog/2015/05/26/science-vs-technology/technology-keywords-weighted-sorted-by-male.png)

*Weighted keywords describing Technology ordered by male usage. View the non-weighted version [**here**](http://fisherevans.com/files/posts/science-vs-technology/img/keywords/technology/non-weighted/male.png).*

*![technology keywords weighted, sorted by female](https://media.fisher.sh/blog/2015/05/26/science-vs-technology/technology-keywords-weighted-sorted-by-female.png)*

*Weighted keywords describing Technology ordered by female usage. View the non-weighted version [**here**](http://fisherevans.com/files/posts/science-vs-technology/img/keywords/technology/non-weighted/female.png).*

#### **Comparing Them**

One of the questions on my survey also asked people to rate the similarity between Science and Technology. With 1 meaning they're totally different and 10 meaning they're the same thing the average surveyee rated the similarity at 6.9 (male average: 6.7. female: 7.1). The rating isn't on a finite scale and the result is up to interpretation, but in general it seems that people think that the two are fairly similar to each other.

![science equals tech?](https://media.fisher.sh/blog/2015/05/26/science-vs-technology/science-equals-tech.png)

*Submission ratings of the similarity between Science and Technology.*

If we take the intersection between the top 15 keywords for both Science and Technology we find that the following words were used to describe both: things, life, and world. You can come to a lot of conclusions, but I'd like to think that the relationship is that Science is the knowledge of, and Technology is application or tools of the things in this world that affect our lives. But that might just be wishful thinking. If we expand the keyword count to 25 from 15, we also find that advance enters the intersection implying that both do in fact advance the human kind.

## **Reflections**

I started this survey out of pure curiosity and ended up finding some pretty neat findings. I think if anything the cumulative results of this little social test reaffirmed my understanding of what both Science and Technology are, and how they relate. That being said, most information I found is purley subjective. None of this was professionally documented or obtained and my "findings" should be taken with a grain of salt.

[**Cover Photo by Freepik**](http://www.freepik.com/free-vector/space-education-background_780903.htm)
