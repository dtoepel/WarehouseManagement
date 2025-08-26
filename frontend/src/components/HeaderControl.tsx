type HeaderControlProps = {
    onAddProductClick: () => void;
    query: string;
    onQueryChange: (v: string) => void;
    filteredCount:number;
    totalCount:number;
};

export default function HeaderControl({onAddProductClick, query, onQueryChange, filteredCount, totalCount}: HeaderControlProps) {
    return (
        <div className='header-container'>
            <div className='app-title'>
                <h1>Warehouse Management</h1>
            </div>
            <div className='header-controls'>
                {/*Header area*/}
                <div className="search-box">
                    <input
                        type='text'
                        placeholder='Search name or SKU…'
                        aria-label='Search products'
                        value={query}
                        onChange={(e) => onQueryChange(e.target.value)}
                    />
                </div>
                <div className="table-toolbar">
                    <button className="btn" onClick={onAddProductClick}>
                        Add Product
                    </button>
                </div>
            </div>
            <div style={{ fontSize: 14, color: "#666", textAlign: "left", paddingBottom: "0.5rem", paddingLeft: "0.50rem"}}>
                {filteredCount} / {totalCount} items
            </div>
        </div>
    );
};
