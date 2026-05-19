---
layout: post
title: "Checking Citations Against Authoritative Sources in the AI Era"
preamble: "I built a Python tool that checks references in .bib or PDF files against authoritative databases and flags possible hallucinations or typos for further investigation."
---

A few months ago, I was reviewing a paper when I came across something strange: the paper cited a well-known paper that I recognized (in terms of title, topic), but the first author’s surname was very much incorrect.

Surprised by this, I took ~40 minutes out of my day to manually check the paper’s entire bibliography, ultimately finding that a majority of the references in the paper were likely hallucinated (e.g., titles that resembled published work but didn’t match, made-up authors, incorrect DOIs, etc.).  After doing this tedious checking procedure manually a couple times, I thought that there must be a way to use some clever parsing to check a given bibliography against authoritative databases of published academic work.

In particular, I’m an avid user of the website [doi2bib.org](http://doi2bib.org/)[^1] — it’s an extremely convenient way to get authoritative BibTeX for a given paper, it’s almost always correct, and it’s a simple copy/paste workflow. It’s particularly helpful for papers on platforms that don’t prominently feature native BibTeX exports (or worse, force you to download a dedicated .bib file containing a single entry, e.g., ScienceDirect).  In other words, I knew the infrastructure was there to support a mapping between true metadata (title, authors, DOI, etc.) and citations.

## The Tool

![Screenshot of the citation-checker command-line tool for verifying bibliographies.](https://adamlechowicz.github.io/assets/img/screenshot.png)

I built a tool to do this automatically (with some help from Claude Code).  Although I used LLMs to help with the coding, the tool is completely deterministic (no AI in the verification loop) — it basically relies on parsing bibliographies using regular expressions and matching the actual text in a PDF or .bib file against a few databases (v1 uses DOI, CrossRef, arXiv, OpenAlex, and Semantic Scholar).  It uses fuzzy matching to allow for some variations (e.g., A. Lechowicz and Adam Lechowicz count as a match), and reports a range of possible outcomes for each cited work.

This tool has saved me a lot of time over the past few months.  The first pass using this tool is  not usually perfect — for instance, references that cite newspaper articles or websites are not verified directly using the tool.  But the tool does flag specific references that warrant further investigation and significantly speed up my subsequent manual check: for instance, often a majority of a bibliography (especially entries that contain DOIs) can be verified automatically, letting me focus on those references that would not be listed in a database or have genuine errors.  The tool has helped me catch several typos in my own bibliographies over the past few months, and it has been similarly useful for reviewing as well.

In recent weeks, academic discourse around LLM-hallucinated references has been reignited by [arXiv’s new policy](https://x.com/tdietterich/status/2055000956144935055?s=20) that imposes penalities on authors who are listed on a paper with incorrect references.  These developments gave me the motivation I needed to polish up my tool and release it publicly.  [I published the tool on PyPI](https://pypi.org/project/citation-checker/), and you can install it with `pip install citation-checker` in a terminal with Python installed.  Usage is detailed on the PyPi project website, and the full source code is available at [this GitHub repo](https://github.com/adamlechowicz/citation-checker).

I hope this will be useful for the broader research community!  Please try it out and let me know if you run into any problems via GitHub “Issues.”  The tool is fastest and most accurate when given BibTeX (`.bib` files) as input, since the bibliography is already structured.  The tool has a parser that will also process the bibliography section of a paper provided in PDF format, although this can sometimes fail in weird ways — be sure to double check the outputs against the PDF to make sure the parser is correctly extracting the content of the bibliography.

I’ve evaluated the tool on a range of papers in computer science venues (ACM, USENIX, ML confs), and generally find the accuracy to be pretty good.  The PDF parser is most susceptible to making large errors if citations are provided in a format that the tool doesn’t officially support — if you run into an issue like this, open a GitHub issue and I’ll add that citation format when I have time.

[^1]: Besides doi2bib.org, I also really like this [BibTeX tidy tool](https://flamingtempura.github.io/bibtex-tidy/index.html) built by Peter West, and this [arxiv-latex-cleaner](https://pypi.org/project/arxiv-latex-cleaner/) tool (unofficially) published by Google, which removes comments from TeX source before you upload it to arXiv.
