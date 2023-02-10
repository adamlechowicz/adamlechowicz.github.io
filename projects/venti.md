---
layout: post
title: 'Venti'
---

{% include image.html url="https://github.com/adamlechowicz/venti" image="projects/proj-4/thumb.jpg" %}

Venti is a carbon-aware battery management tool for Apple Silicon MacBooks.

[(Venti on GitHub)](https://github.com/adamlechowicz/venti)

The tool is meant for MacBooks which are plugged into a power source most of the time. It fulfills two design goals simultaneously: first, it keeps the battery charged to 80%, which helps prolong its longevity. Second, when the battery percentage does drop below 80%, Venti uses carbon intensity data from CO2signal to defer charging until grid electricity is sufficiently clean, reducing your carbon footprint.

## Key Features

* Automatically disables charging when your battery is above 80% charged, effectively maintaining a constant state of charge at 80%.

* While your MacBook is plugged into a power source, the battery will not discharge (by default)

* Enables charging when your battery is under 80% charged and grid carbon emissions are low while plugged into a power source.

* Settings are persistent across reboots and even after closing the GUI menu bar app.

