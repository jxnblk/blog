---
title: Domain-Specific Design Languages
date: 2016-06-30
draft: true
---

#  Domain-Specific Design Languages

- definition of DSL
  > A domain-specific language (DSL) is a computer language specialized to a particular application domain. This is in contrast to a general-purpose language (GPL), which is broadly applicable across domains.
  https://en.wikipedia.org/wiki/Domain-specific_language
  > A domain-specific language is created specifically to solve problems in a particular domain and is not intended to be able to solve problems outside it (although that may be technically possible). In contrast, general-purpose languages are created to solve problems in many domains.

- consider designing in iOS, it requires domain-specific (i.e. platform-specific) design conventions and patterns, predominantly outlined in Apple's HIG

Deviating from the HIG means you are creating a new design language specific to your application,
which may have its benefits, but also requires more learning on the part of the user.

Similarly, deviating from a web application's style guide, UI component library, or interaction pattern library
is equivalent to creating a new design language that users need to learn.

The web itself has it's own design language.
Users have acclimated to using blue underlined links, scrolling through pages, using standard form elements,
as well as a plethora of other interaction design patterns.

Though sometimes DSLs are appropriate,
the main disadvantage to using a DSL is that it requires domain-specifig knowledge of certain APIs rather than relying on more standard conventions. An example of this would be using coffeescript or JSX, rather than the standardized JavaScript (EMCAScript) syntax
