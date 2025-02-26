import React from 'react';

interface PaginationProps {
    paginationMeta: {
        links: { url: string | null; label: string; active: boolean }[];
    } | null;
    onPageChange: (url: string) => void;
}

const Pagination: React.FC<PaginationProps> = ({ paginationMeta, onPageChange }) => {
    if (!paginationMeta) return null;

    return (
        <nav className="flex justify-center mt-8" aria-label="Pagination">
            <ul className="inline-flex items-center -space-x-px">
                {paginationMeta.links.map((link, index) => (
                    <li key={index}>
                        <button
                            onClick={() => link.url && onPageChange(link.url)}
                            className={`px-3 py-2 leading-tight ${link.active
                                ? 'z-10 bg-orange-600 text-white border border-orange-600'
                                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700'
                                } ${index === 0 ? 'rounded-l-lg' : ''} ${index === paginationMeta.links.length - 1 ? 'rounded-r-lg' : ''
                                }`}
                            disabled={!link.url}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Pagination;
