# redmart-challenge
This is my solution to this question -> http://geeks.redmart.com/2015/01/07/skiing-in-singapore-a-coding-diversion/

This solution works by iterating over each cell in order of their height, highest first. Cells are given a score, which is set to 1 if the cell has no neighbours with a higher height, and otherwise set to the score of the highest neighbour plus 1. It also tracks the height of the highest connected peak. If two cells have the same score, the height of the highest connected peak is used as the score instead.
