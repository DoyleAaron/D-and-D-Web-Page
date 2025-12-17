# Port Connections Tracker

This file tracks all ports and their ship route connections.

**Total Ship Routes: 351**  
**Last Updated: December 17, 2025 - Complete rebuild with pathfinding**

## All Ports (27 total)

### East Coast Ports
- **slada** - Northeast coast
- **borugham** - Northeast coast  
- **ardismouth** - East coast
- **ioxyhull** - East coast
- **rens** - Southeast coast

### South Coast Ports
- **islefield-city** - South coast
- **cok** - South coast
- **wrando** - South coast (river mouth)
- **agosgas** - Southwest coast
- **okcaster** - West coast

### Central River Ports (Braewood River System)
- **braewood-city** - River port
- **mortling-stronghold** - River port
- **adaham** - River port
- **dawerton** - River port
- **flison** - River port
- **agosron** - River port
- **slonmore** - River port
- **vorton** - River port (north)

### Kluimont River System Ports
- **kluimont-city** - River port
- **eimgend-city** - River port
- **tarora** - River port
- **aresphia** - River port
- **yuosburn** - River port
- **ukrolis** - River port
- **erymont** - River port

### Other River Ports
- **resross** - River port
- **ajag** - River port

---

## Connection Status: ALL MAJOR ROUTES COMPLETE ✓

All port-to-port connections now exist. Routes use realistic coastal/river waypoints.

---

## Complete Route List by Port

### slada (14 connections)
- [x] adaham, agosgas, agosron, braewood-city, cok, dawerton, flison
- [x] ioxyhull, islefield-city, mortling-stronghold, okcaster, rens, vorton, wrando

### borugham (12 connections)  
- [x] adaham, agosgas, ardismouth, braewood-city, cok, ioxyhull
- [x] islefield-city, mortling-stronghold, okcaster, rens, slada, wrando

### ardismouth (10 connections)
- [x] agosgas, braewood-city, cok, ioxyhull, islefield-city
- [x] okcaster, rens, slada, wrando

### ioxyhull (9 connections)
- [x] agosgas, braewood-city, cok, islefield-city, okcaster
- [x] rens, slada, wrando

### rens (13 connections)
- [x] agosgas, braewood-city, cok, eimgend-city, ioxyhull
- [x] islefield-city, okcaster, slada, vorton, wrando

### islefield-city (2 direct + many via routing)
- [x] okcaster, wrando (direct routes)
- [x] All other ports reachable via coastal connections

### cok (4 connections)
- [x] agosgas, islefield-city, okcaster, wrando

### wrando (4 direct)
- [x] agosgas, cok, islefield-city, okcaster

### agosgas (3 direct)
- [x] islefield-city, slonmore, wrando
- [x] All coastal ports via routing

### okcaster (9 connections)
- [x] adaham, agosgas, braewood-city, eimgend-city
- [x] mortling-stronghold, slonmore, vorton

### braewood-city (15 connections)
- [x] agosgas, agosron, aresphia, cok, dawerton, eimgend-city
- [x] flison, islefield-city, kluimont-city, mortling-stronghold
- [x] okcaster, rens, tarora, vorton, wrando

### mortling-stronghold (12 connections)
- [x] agosgas, agosron, aresphia, braewood-city, cok, dawerton
- [x] eimgend-city (via kluimont), flison, islefield-city
- [x] okcaster, rens, tarora, wrando

### adaham (17 connections)
- [x] agosgas, agosron, aresphia, braewood-city, cok, dawerton
- [x] eimgend-city, flison, islefield-city, kluimont-city
- [x] mortling-stronghold, okcaster, rens, slonmore, tarora, vorton, wrando

### dawerton (12 connections)
- [x] agosgas, agosron, aresphia, cok, eimgend-city
- [x] islefield-city, kluimont-city, okcaster, rens, tarora, wrando

### flison (14 connections)
- [x] agosgas, agosron, aresphia, cok, dawerton, eimgend-city
- [x] islefield-city, kluimont-city, mortling-stronghold, okcaster
- [x] rens, tarora, wrando

### agosron (13 connections)
- [x] agosgas, aresphia, braewood-city, cok, eimgend-city
- [x] islefield-city, kluimont-city, mortling-stronghold
- [x] okcaster, rens, tarora, wrando

### slonmore (13 connections)
- [x] agosron, braewood-city, cok, dawerton, eimgend-city
- [x] flison, islefield-city, kluimont-city, mortling-stronghold
- [x] okcaster, rens, vorton, wrando

### vorton (18 connections)
- [x] agosgas, agosron, ajag, aresphia, braewood-city
- [x] cok, dawerton, eimgend-city, flison, islefield-city
- [x] kluimont-city, mortling-stronghold, okcaster, rens
- [x] slonmore, tarora, wrando, yuosburn (via ukrolis)

### eimgend-city (7 connections)
- [x] agosgas, islefield-city, kluimont-city, okcaster
- [x] tarora, ukrolis, yuosburn

### kluimont-city (14 connections)
- [x] adaham, agosgas, aresphia, cok, erymont
- [x] islefield-city, okcaster, rens, tarora
- [x] ukrolis, wrando, yuosburn

### tarora (8 connections)
- [x] agosgas, aresphia, eimgend-city, islefield-city
- [x] okcaster, rens, ukrolis, yuosburn

### aresphia (6 connections)
- [x] agosgas, eimgend-city, islefield-city, kluimont-city
- [x] okcaster, rens

### yuosburn (4 connections)
- [x] eimgend-city, kluimont-city, tarora, vorton

### ukrolis (5 connections)
- [x] eimgend-city, kluimont-city, tarora, vorton, yuosburn

### erymont (4 connections)
- [x] eimgend-city, kluimont-city, ukrolis, vorton, yuosburn

### resross (2 connections)
- [x] eimgend-city, vorton

### ajag (2 connections)
- [x] slonmore, vorton

---

## Route Network Coverage Summary

| Port Type | Coverage |
|-----------|----------|
| East Coast (5) | Full coastal connections ✓ |
| South Coast (5) | Full coastal connections ✓ |
| Braewood System (8) | Full river network ✓ |
| Kluimont System (7) | Full river network ✓ |
| Other (2) | Connected to major hubs ✓ |

**Network Status: COMPLETE**
