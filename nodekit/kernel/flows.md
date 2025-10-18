# 

This document outlines functionality that NodeKit might implement.

# Flow template
* Cards: 
* UpdateRules:
  * Placing and un-placing Cards at timepoints
  * Placing and un-placing Cards, contingent on a Card state becoming realized 
  * 
* ExitRules: (Sensors?)
  * Predicates on the ActionStream (i.e., the current state of Cards)
  * Predicates on the KeyStream
* Semantic Action: 

## Flow: Ballistic. click (in one of N regions) or key press (one of N keys); 

* Cards: Define Cards.
* UpdateRules: Rules which set Card visibility to True / False on Board based on intended lifespans. Set `.selectable` at the appropriate time.
* ExitRules: WHEN {x}CardEvent.selected = true. 
  * Implementation-wise: Each exit rule is an if check applied to an incoming CardEvent. Each such predicate is given an ActionId.
* Semantic Action: The user had named the N choices. The Action reports the name.


### Variation: with hover effect
* Initialize hoverable Cards with `.hoverable=True`; if they are not always hoverable, add an UpdateRule which sets `.hoverable=True` at the requisite time.

## Flow: showing reinforcer; user just waits
* Cards: Visual Cards which describe the Reinforcer screen.
* UpdateRules: Usually, none. Just initialize to `.visible=True`. Otherwise, rules which set Card visibility to True / False on Board based on intended lifespans. 
* ExitRules: WHEN clock.elapsed >= T.
  * Implementation-wise: just add the termination callback to the event scheduler at T. 
* Semantic Action: none; maybe "waited".

## Flow: Slider.
* Cards: a SliderCard, and a TextCard with `.selectable=False`.
* UpdateRules: Timespan rules for SliderCard. A rule WHEN SliderCard.touched = true to set TextCard to `.visible=True` 
* ExitRules: When  `{TextCard}.selected=True`. An if check on the incoming CardEvent. 
* Semantic Action: the final SliderMoved.


## Flow: MultiSelect. (de)select between n1 and n2 choices out of N; then confirm them
* Cards: N selectable Cards. One TextCard with `.selectable=False`. The selectable cards have been named.
* UpdateRules: Timespan rules for the selectable cards. A rule which conditionally sets TextCard.selectable=True once at least n1 are selected. A rule which sets all except the n2 selected cards to unselectable when there are n2 selected cards. 
  * Implementation: seems the global context needs a register here summarizing the current selection states.
* ExitRules: When  `{TextCard}.selected=True`. An if check on the incoming CardEvent.
* Semantic Action: a dict of (CardId -> boolean) 

### Variation: must look first before selecting
* Set UpdateRules which toggle `.selectable` on the N cards.


## Flow: Free text entry.
* Cards: FreeTextEntryCard, and a 'submit card'.
* UpdateRules: an update rule WHEN regex(textinput)=True. -> submit activated 
  * Implementation: callback whenever text changes is fair, and not so bad.
* ExitRules: submit pressed.
* Semantic Action: the confirmed text.

## Flow: Discrete Carousel. Select one of N choices' visibility, then commit. (buttons)
* Cards: write N ImageCards, and a submit card. 
* UpdateRules: WHEN left_button.selected == true, set all visible to False, except for i-1. etc.
* ExitRules: submit pressed
* Semantic Action: the CardId of the ImageCard selected.

### Variation: using Keys
* Rewire UpdateRules to use keys. 

## Flow: Continuous Carousel. Alter the parameters of a Card, then commit
* Cards: write a ParametricCard (e.g., the ColorCard is a parametric card).
* UpdateRules: WHEN .left_button.selected=True, change register (use current register expression)
* ExitRules: submit pressed
* Semantic Action: the parameters of the ParametricCard in question.

## Flow: Instructions.
See DiscreteCarousel. 

## Flow: Continuous tracking of a moving target using pointer for T seconds. 
* Cards: write the target's *Card. Possibly set its hover state, if we want visual feedback effect.
* UpdateRules: the main challenge here is encoding an on-rails animation for the moving target. Thoughts? 
* ExitRules: WHEN clock.elapsed >= T.
* Semantic Action: the trajectory across T.

## Flow: free sort images within a region.
* Cards: write the source Cards, with `.draggable=True`. Set a region with a RegionCard. Submit button.
* UpdateRules: 
  * the main challenge here is expressing the rule that Cards won't be moved outside of a certain region. Perhaps a rule which 'snaps' any source Card back in after a drag ends (the Card emits when the drag ends)
  * usual variations of commit gate on the submission button; e.g. when at least one source Card moved. 
* ExitRules: Submission pressed.
* Semantic Action: the final position of the Cards on the Board.

## Flow: Reordering a list of items.
Not supported. Snapping here would be too hard, for not enough payoff. Also, this is too UI coded.

## Flow: doodle
* Cards: DoodleCard. Responsible for drawing self. Submit button.
* UpdateRules: Usual submit logic, predicated on Doodle state here. 
* ExitRules: Submission pressed
* Semantic Action: Final doodle. 



# Stimuli

## Video

## Audio

## Parametric: RDK

## Parametric: Drifting gratings



# Control flows
## Flow: choose a reinforcer
## Flow: supervised feedback
## Flow: staircase
