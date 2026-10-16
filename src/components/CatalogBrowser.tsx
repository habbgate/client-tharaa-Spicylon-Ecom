"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { HiOutlineSearch, HiOutlineX, HiOutlineAdjustments, HiOutlineArrowRight } from "react-icons/hi";
import ProductCard from "./ProductCard";

type Filters = { q: string; sort: string; stock: boolean; max: number; page: number };
const PAGE_SIZE = 12;

function readFilters(query: string, ceiling: number): Filters {
  const params = new URLSearchParams(query);
  const max = Number(params.get("max"));
  const page = Number(params.get("page"));
  return {
    q: (params.get("q") || "").slice(0, 200),
    sort: ["name", "price-low", "price-high"].includes(params.get("sort") || "") ? params.get("sort")! : "featured",
    stock: params.get("stock") === "available",
    max: params.has("max") && Number.isFinite(max) ? Math.max(0, Math.min(ceiling, max)) : ceiling,
    page: Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1,
  };
}

export default function CatalogBrowser({ products, currency, initialQuery }: { products: any[]; currency: string; initialQuery: string }) {
  const t = useTranslations("Studio");
  const ceiling = Math.max(1, Math.ceil(Math.max(0, ...products.map(product => Number(product.price[currency]) || 0))));
  const [filters, setFilters] = useState(() => readFilters(initialQuery, ceiling));
  const [expanded, setExpanded] = useState(false);
  const update = (patch: Partial<Filters>) => setFilters(current => ({ ...current, ...patch, page: 1 }));
  const reset = () => setFilters({ q: "", sort: "featured", stock: false, max: ceiling, page: 1 });

  useEffect(() => {
    const back = () => setFilters(readFilters(window.location.search, ceiling));
    window.addEventListener("popstate", back);
    return () => window.removeEventListener("popstate", back);
  }, [ceiling]);

  const matches = useMemo(() => {
    const words = filters.q.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    const result = products.filter(product => {
      const text = `${product.name} ${product.description} ${product.category}`.toLocaleLowerCase();
      const price = Number(product.price[currency]);
      return Number.isFinite(price) && price <= filters.max && (!filters.stock || product.stock > 0) && words.every(word => text.includes(word));
    });
    if (filters.sort === "name") result.sort((a, b) => a.name.localeCompare(b.name));
    if (filters.sort === "price-low") result.sort((a, b) => Number(a.price[currency]) - Number(b.price[currency]));
    if (filters.sort === "price-high") result.sort((a, b) => Number(b.price[currency]) - Number(a.price[currency]));
    return result;
  }, [products, currency, filters]);
  const pages = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
  const page = Math.min(filters.page, pages);
  const visible = matches.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const activeCount = Number(!!filters.q.trim()) + Number(filters.stock) + Number(filters.max < ceiling);
  const hasChanges = activeCount > 0 || filters.sort !== "featured";

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.q.trim()) params.set("q", filters.q.trim());
    if (filters.sort !== "featured") params.set("sort", filters.sort);
    if (filters.stock) params.set("stock", "available");
    if (filters.max < ceiling) params.set("max", String(filters.max));
    if (page > 1) params.set("page", String(page));
    const next = `/products${params.size ? `?${params}` : ""}`;
    if (window.location.pathname + window.location.search !== next) window.history.replaceState(null, "", next);
  }, [filters, ceiling, page]);

  const summary = t("resultsSummary", { first: matches.length ? (page - 1) * PAGE_SIZE + 1 : 0, last: Math.min(page * PAGE_SIZE, matches.length), count: matches.length });

  return <section className="catalog-studio" id="catalog-search">
    <div className="catalog-studio-top"><div><span className="shop-eyebrow">{t("collectionLabel")}</span><h2>{t("collectionTitle")}</h2></div><p>{t("collectionText")}</p></div>
    <div className="catalog-live-search"><HiOutlineSearch aria-hidden="true" /><label className="sr-only" htmlFor="spice-search">{t("search")}</label><input id="spice-search" type="search" value={filters.q} onChange={event => update({ q: event.target.value })} placeholder={t("searchPlaceholder")} maxLength={200} autoComplete="off" />{filters.q && <button type="button" aria-label={t("clearSearch")} onClick={() => update({ q: "" })}><HiOutlineX /></button>}</div>
    <div className="catalog-studio-layout">
      <aside className={`catalog-sidebar ${expanded ? "is-expanded" : ""}`}>
        <button className="catalog-mobile-toggle" onClick={() => setExpanded(!expanded)} aria-expanded={expanded} aria-controls="catalog-filter-fields"><span><HiOutlineAdjustments />{t("filterTitle")}{activeCount > 0 && <b>{activeCount}</b>}</span><span>{expanded ? "−" : "+"}</span></button>
        <div className="catalog-sidebar-fields" id="catalog-filter-fields"><div className="catalog-sidebar-heading"><h3>{t("filterTitle")}</h3>{hasChanges && <button onClick={reset}>{t("clearFilters")}</button>}</div>
          <fieldset><legend>{t("priceFilter")}</legend><div className="catalog-price-label"><span>{currency} 0</span><output htmlFor="spice-price">{currency} {filters.max.toFixed(2)}</output></div><label className="sr-only" htmlFor="spice-price">{t("maximumPrice")}</label><input id="spice-price" type="range" min="0" max={ceiling} step="1" value={filters.max} onChange={event => update({ max: Number(event.target.value) })} /><p>{t("priceFilterHint")}</p></fieldset>
          <fieldset><legend>{t("availability")}</legend><label className="catalog-available"><input name="stock" type="checkbox" checked={filters.stock} onChange={event => update({ stock: event.target.checked })} /><span>{t("stockOnly")}</span></label></fieldset>
          <div className="catalog-sidebar-note"><span>CEYLON · SRI LANKA</span><p>{t("sidebarNote")}</p></div>
        </div>
      </aside>
      <div className="catalog-listing"><div className="catalog-listing-bar"><p role="status" aria-live="polite" className="catalog-count">{summary}</p><div className="catalog-inline-sort"><label htmlFor="spice-sort">{t("sort")}</label><select id="spice-sort" name="sort" value={filters.sort} onChange={event => update({ sort: event.target.value })}><option value="featured">{t("sortDefault")}</option><option value="name">{t("sortName")}</option><option value="price-low">{t("sortLow")}</option><option value="price-high">{t("sortHigh")}</option></select></div></div>
        {hasChanges && <div className="catalog-filter-chips">{filters.q.trim() && <button onClick={() => update({ q: "" })}>{filters.q.trim()}<HiOutlineX /></button>}{filters.stock && <button onClick={() => update({ stock: false })}>{t("stockOnly")}<HiOutlineX /></button>}{filters.max < ceiling && <button onClick={() => update({ max: ceiling })}>{t("underPrice", { currency, price: filters.max })}<HiOutlineX /></button>}<button className="catalog-clear-all" onClick={reset}>{t("clearFilters")}</button></div>}
        {visible.length > 0 ? <div className="catalog-live-grid">{visible.map(product => <ProductCard key={product._id} product={product} currency={currency} />)}</div> : <div className="catalog-no-matches"><HiOutlineSearch aria-hidden="true" /><h3>{t("noResults")}</h3><p>{t("emptyFilterHint")}</p><button onClick={reset}>{t("clearFilters")}<HiOutlineArrowRight /></button></div>}
        {pages > 1 && <nav className="catalog-page-buttons" aria-label={t("pageNavigation")}>{Array.from({ length: pages }, (_, index) => <button key={index} aria-current={page === index + 1 ? "page" : undefined} onClick={() => { setFilters(current => ({ ...current, page: index + 1 })); document.getElementById("catalog-search")?.scrollIntoView({ behavior: "smooth" }); }}>{index + 1}</button>)}</nav>}
      </div>
    </div>
  </section>;
}
