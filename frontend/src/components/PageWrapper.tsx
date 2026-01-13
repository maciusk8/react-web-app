import type { ReactNode } from 'react';
import DoubleNavbar from './DoubleNavbar';
import Footer from './Footer';

interface PageWrapperProps {
    children: ReactNode;
    showFooter?: boolean;
}

export default function PageWrapper({ children, showFooter = true }: PageWrapperProps) {
    return (
        <div className="page-wrapper">
            <DoubleNavbar />
            <main>
                {children}
            </main>
            {showFooter && <Footer />}
        </div>
    );
}
