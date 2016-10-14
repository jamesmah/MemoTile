# MemoTile
[https://jamesmah.github.io/MemoTile/](https://jamesmah.github.io/MemoTile/)

###Goal
A two player game which allows for customisable tokens and board size.
I picked a tile based game system that was simpler than checkers
but different from tictactoe and would make more sense to scale the grid size.
I was interested in getting a better understanding of jQuery for DOM manipulation and effects.

---

###Technologies used
HTML, CSS, Javascript, jQuery (& jQuery effects!)

---

###Approach taken:
1. Built html document with 
2. Built the layout first (lots of divs, responsive)
  * Used square images, coloured divs
  * Just a rough placement of divs and containers
  * Used 3 media queries for 4 different aspect ratio ranges
  * Used lots of vh, vm
  * Transition is nice :smile:
3. Built most of the javascript functionality
4. Updated the temp images with final images
  * Stole some images from the internet (http://www.flaticon.com/packs/pokemon-go)
  * Coverted some of the svg files to edit the colours (for hovering), orientation (e.g. cursor icon & browser icon)
  * Picked a nice BG, and tried to match the colour scheme
5. Added hover image switching (and cursor too)
6. Added jQuery effects (rather than hide(), show() )
7. Adjusted time delays for a smoother transition between steps
8. Added icon, audio
9. Debugging & touch up (added the crown!)
  * There's still some bugs in the mouse transition from red to blue and back

---

###ANGRY bits

1. Had some trouble with widths updating according to the height of the page. Was using % at first, but changed to vh and calc
* Would be useful if there was an aspect ratio lock for divs
2. Hover does not work on the first item on the grid when game initiates
3. Hovering doesn't really work well on mobile. Images get stuck
4. Not all media queries really work with safari (it seems)

---

###Lessons learned

1. **PLAN MORE**
  * Map out all the buttons and find out which variables and functions will be used
  * I have multiple instances of similar functions that does slightly different things because the first version of the function does a bit more than what is required
  * Use more classes in CSS, find out which elements have the same attributes
2. To write nice code (for maintainability), and reduce debugging, should KISS and DRY code before proceeding to the next function. (due to time restriction I just went YOLO)
3. jQuery really helped shorten the amount of code,
no need for getting element, and then using while loops. Effects are nice

---

### Future works

1. Probably implement max() function in CSS instead of 2 extra media queries
2. DRY the javascript document.
3. DRY the javascript document.. 
4. Add comments in code
5. Use LocalStorage or SessionStorage to persist data locally to allow games to continue after page refresh or loss of internet connectivity
6. Socket.io for remote play
7. Find a solution to host the website for different projects. Currently have multiple copies of the Memotile folder: on the project repo and in a folder in the website repo.




