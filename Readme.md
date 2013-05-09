hl-group
========

A collection of angular directives to enable keyboard control (up and down) a group of related elements.

It works by adding a class to the highlighted element directly rather than manipulating element scopes. This is mainly due to needing to know the document order of elements - directives aren't rendered in document order whereas jQuery sets are in order.
