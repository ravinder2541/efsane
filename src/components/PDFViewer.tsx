'use client'

import { useState } from 'react'
import { Download, FileText, Eye, X, ZoomIn, ZoomOut } from 'lucide-react'

interface PDFViewerProps {
  pdfUrl: string
  title: string
  className?: string
  language?: 'de' | 'en'
}

export default function PDFViewer({ pdfUrl, title, className = '', language = 'de' }: PDFViewerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [pdfLoadError, setPdfLoadError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Localized text
  const texts = {
    de: {
      viewMenu: 'Speisekarte ansehen',
      downloadPDF: 'PDF herunterladen',
      openInNewTab: 'In neuem Tab öffnen',
      zoomOut: 'Verkleinern',
      zoomIn: 'Vergrößern',
      download: 'Herunterladen',
      close: 'Schließen',
      jsRequired: 'JavaScript ist erforderlich, um die Speisekarte anzuzeigen.',
      downloadHere: 'hier herunterladen'
    },
    en: {
      viewMenu: 'View Menu',
      downloadPDF: 'Download PDF',
      openInNewTab: 'Open in New Tab',
      zoomOut: 'Zoom Out',
      zoomIn: 'Zoom In',
      download: 'Download',
      close: 'Close',
      jsRequired: 'JavaScript is required to view the menu.',
      downloadHere: 'download here'
    }
  }

  const t = texts[language]

  // Handle PDF loading errors
  const handlePdfError = () => {
    setPdfLoadError(true)
    setIsLoading(false)
  }

  const handlePdfLoad = () => {
    setIsLoading(false)
    setPdfLoadError(false)
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = title
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50))
  }

  return (
    <>
      {/* PDF Action Buttons */}
      <div className={`flex flex-col sm:flex-row gap-4 ${className}`}>
        {/* View PDF Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-3 bg-primary-600 hover:bg-primary-700 text-white px-6 py-4 rounded-lg transition-all duration-300 hover-lift group"
        >
          <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-medium">{t.viewMenu}</span>
        </button>

        {/* Download PDF Button */}
        <button
          onClick={handleDownload}
          className="flex items-center justify-center space-x-3 bg-secondary-500 hover:bg-secondary-600 text-white px-6 py-4 rounded-lg transition-all duration-300 hover-lift group"
        >
          <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-medium">{t.downloadPDF}</span>
        </button>

        {/* Direct Link */}
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center space-x-3 bg-neutral-600 hover:bg-neutral-700 text-white px-6 py-4 rounded-lg transition-all duration-300 hover-lift group"
        >
          <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-medium">{t.openInNewTab}</span>
        </a>
      </div>

      {/* PDF Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-primary-600" />
                <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Zoom Controls */}
                <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={handleZoomOut}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title={t.zoomOut}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1 text-sm font-medium min-w-[60px] text-center">
                    {zoom}%
                  </span>
                  <button
                    onClick={handleZoomIn}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title={t.zoomIn}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                {/* Download Button */}
                <button
                  onClick={handleDownload}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title={t.download}
                >
                  <Download className="w-5 h-5" />
                </button>

                {/* Close Button */}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title={t.close}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PDF Content */}
            <div className="flex-1 overflow-auto bg-gray-100">
              <div className="p-4 flex justify-center">
                <div className="w-full max-w-4xl">
                  {/* Primary PDF Display Method */}
                  <object
                    data={`${pdfUrl}#zoom=${zoom}&toolbar=1&navpanes=1&scrollbar=1`}
                    type="application/pdf"
                    className="w-full h-[800px] border-0 rounded-lg shadow-lg bg-white"
                    title={title}
                    onLoad={handlePdfLoad}
                    onError={handlePdfError}
                  >
                    {/* Fallback for browsers that don't support object tag */}
                    <embed
                      src={`${pdfUrl}#zoom=${zoom}&toolbar=1&navpanes=1&scrollbar=1`}
                      type="application/pdf"
                      className="w-full h-[800px] border-0 rounded-lg shadow-lg bg-white"
                      title={title}
                      onLoad={handlePdfLoad}
                      onError={handlePdfError}
                    />
                    
                    {/* Final fallback if PDF can't be displayed */}
                    <div className="w-full h-[800px] bg-white rounded-lg shadow-lg flex flex-col items-center justify-center p-8 text-center">
                      <div className="mb-6">
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                          {language === 'de' ? 'PDF kann nicht angezeigt werden' : 'PDF cannot be displayed'}
                        </h3>
                        <p className="text-gray-600 mb-6">
                          {language === 'de'
                            ? 'Ihr Browser unterstützt die PDF-Anzeige nicht. Bitte laden Sie die Datei herunter oder öffnen Sie sie in einem neuen Tab.'
                            : 'Your browser does not support PDF display. Please download the file or open it in a new tab.'
                          }
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          onClick={handleDownload}
                          className="flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors"
                        >
                          <Download className="w-5 h-5" />
                          <span>{t.downloadPDF}</span>
                        </button>
                        
                        <a
                          href={pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
                        >
                          <FileText className="w-5 h-5" />
                          <span>{t.openInNewTab}</span>
                        </a>
                      </div>
                    </div>
                  </object>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fallback for browsers that don't support iframe PDF viewing */}
      <noscript>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
          <p className="text-yellow-800">
            {t.jsRequired}{' '}
            <a
              href={pdfUrl}
              className="text-primary-600 hover:text-primary-700 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.downloadHere}
            </a>.
          </p>
        </div>
      </noscript>
    </>
  )
}