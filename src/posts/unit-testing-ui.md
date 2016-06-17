---
title: 'Unit testing UI'
created: '5-13-2016'
draft: true
---

I recently read
[this excellent article](http://product.voxmedia.com/2016/4/20/11458814/how-designers-can-use-unit-testing-to-build-resilient-and-happy-design-systems),
where the design team at Vox has devised a testing framework for new UI components introduced into their pattern library.
While the methods they suggest are excellent, and what I’d consider something that should be industry-standard in our field,
it got me thinking that this concept could be taken a step further.
What if designers wrote actual unit tests for UI components.
What if those tests were actually applied in user acceptance testing, A/B tests, and tested against performance metrics.

## What would a unit test look like?

This is a really contrived example of what a UI unit test could look like:

```
describe: CTA button
  context: when a user sees the button
    expect: Users should know that the button is clickable
    expect: User should be able to click the button
    expect: Conversions should be above 4%
```


Taking a cue from test driven development, these tests should be written before any design work is started, and they should "fail" (because there’s no design yet).

Any work that follows should be towards making those tests pass.

## "Running" tests

Once you have a potential component, or even better, several potential components, you’d be ready to start testing it against the unit tests previously written. These tests shouldn’t overshadow the typical formats and methodologies of user testing, A/B testing, etc. instead they should be used as an analytical tool to gauge the results.

If, when user testing a potential solution, the test doesn’t pass, there’s still more design work to do.

If, after rolling out a new component, testing shows that conversion is lower than expected, there’s still more work to do.

If users are bouncing at higher-than-anticipated rates because of slow page load, there’s still more work to be done.

Now, I will admit that design work is a lot less black and white than software development can be, and that it might be easy to shoot yourself in the foot with an approach like this. If, for example, conversion never gets above 3.9%, and you spend 2 weeks designing and redesigning a button, there’s probably some other variable affecting things, and there are better ways to prioritize your time.

But taking this idea as an approach to problem solving, gauging the efficacy of a design solution, and setting up goals for a product, I think it’s a concept worth exploring.

I’ve seen too much design work fall into political or egotistical downward spirals of endless bikeshedding. At the end of the day, you are not being paid for being you. You are being paid for the value you bring to a company.

