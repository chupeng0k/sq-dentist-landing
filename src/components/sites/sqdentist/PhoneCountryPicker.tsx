"use client";
/* Original SVG flag assets are served locally. */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import countries from "@/lib/phone-countries.json";

const preferred = ["VN", "AU", "US", "CA", "GB", "NZ", "SG"];
const sorted = [...preferred.map(code => countries.find(country => country.code === code)!), ...countries.filter(country => !preferred.includes(country.code))];
type Country = typeof countries[number];

function Flag({ code }: {code:string}) {
  return <img className="country-flag" src={`/sites/sqdentist/flags/${code.toLowerCase()}.svg`} width={24} height={18} alt=""/>;
}

export function PhoneCountryPicker({ id,value,onChange,invalid,describedBy }: {id:string;value:string;onChange:(code:string)=>void;invalid:boolean;describedBy?:string}) {
  const [open,setOpen] = useState(false);
  const [query,setQuery] = useState("");
  const [active,setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const selected = countries.find(country => country.code === value)!;
  const term = query.trim().toLowerCase();
  const filtered = sorted.filter(country => `${country.name} ${country.code} +${country.dial}`.toLowerCase().includes(term));
  const listId = `${id}-options`;
  function choose(country:Country) { onChange(country.code);setOpen(false);trigger.current?.focus(); }
  useEffect(() => {
    if (!open) return;
    search.current?.focus();
    const outside = (event:PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown",outside);
    return () => document.removeEventListener("pointerdown",outside);
  },[open]);
  useEffect(() => {
    if (!open) return;
    const list = document.getElementById(listId);
    const option = document.getElementById(`${listId}-${active}`);
    if (!list || !option) return;
    const top = option.offsetTop - list.offsetTop;
    if (top < list.scrollTop) list.scrollTop = top;
    else if (top + option.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = top + option.offsetHeight - list.clientHeight;
  },[active,open,listId,query]);
  return <div ref={root} className="country-picker" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false); }}>
    <button ref={trigger} type="button" role="combobox" id={id} className="country-trigger" aria-haspopup="listbox" aria-expanded={open} aria-controls={listId} aria-invalid={invalid} aria-describedby={describedBy} onClick={() => {setQuery("");setActive(0);setOpen(!open);}} onKeyDown={event => { if (event.key === "ArrowDown" || event.key === "ArrowUp") {event.preventDefault();setQuery("");setActive(0);setOpen(true);} }}><Flag code={selected.code}/><span>{selected.name} (+{selected.dial})</span><span aria-hidden="true">⌄</span></button>
    <input type="hidden" name="country" value={value}/>
    {open && <div className="country-popover">
      <div className="country-search"><span aria-hidden="true">⌕</span><input ref={search} type="search" role="combobox" aria-label="Search phone country" aria-autocomplete="list" aria-expanded="true" aria-controls={listId} aria-activedescendant={filtered.length ? `${listId}-${active}` : undefined} placeholder="Search country or code" value={query} onChange={event => {setQuery(event.target.value);setActive(0);}} onKeyDown={event => {
        if (event.key === "Escape") {event.preventDefault();event.stopPropagation();setOpen(false);trigger.current?.focus();}
        if (["ArrowDown","ArrowUp"].includes(event.key)) {event.preventDefault();if(filtered.length)setActive(current => (current + (event.key === "ArrowDown" ? 1 : -1) + filtered.length) % filtered.length);}
        if (event.key === "Enter") {event.preventDefault();if(filtered[active])choose(filtered[active]);}
      }}/></div>
      <div role="listbox" aria-label="Phone countries" id={listId} className="country-options">
        {filtered.map((country,index) => <button type="button" role="option" aria-selected={country.code === value} tabIndex={-1} id={`${listId}-${index}`} key={country.code} className={`country-option${index === active ? " highlighted" : ""}`} onMouseEnter={() => setActive(index)} onMouseDown={event => event.preventDefault()} onClick={() => choose(country)}><Flag code={country.code}/><span>{country.name} (+{country.dial})</span>{country.code === value && <span aria-hidden="true">✓</span>}</button>)}
        {!filtered.length && <p className="country-empty" role="status">No countries found.</p>}
      </div>
    </div>}
  </div>;
}
