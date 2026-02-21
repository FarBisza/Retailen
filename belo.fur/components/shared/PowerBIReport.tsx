import React from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';

interface PowerBIReportProps {
    reportId?: string;
    embedUrl?: string;
    accessToken?: string;
}

const PowerBIReport: React.FC<PowerBIReportProps> = ({
    reportId = 'YOUR_REPORT_ID',
    embedUrl = 'https://app.powerbi.com/reportEmbed?reportId=YOUR_REPORT_ID',
    accessToken = 'YOUR_ACCESS_TOKEN'
}) => {
    return (
        <div className="h-[800px] w-full bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-50 -z-10">
                <div className="text-center">
                    <p className="text-sm font-black uppercase tracking-widest text-slate-900 mb-2">Power BI Dashboard Placeholder</p>
                    <p className="text-xs text-gray-500 max-w-md mx-auto">
                        To view the report, you need to configure valid <code>reportId</code>, <code>embedUrl</code>, and <code>accessToken</code> in the code.
                    </p>
                </div>
            </div>

            <PowerBIEmbed
                embedConfig={{
                    type: 'report',   // Supported types: report, dashboard, tile, visual, qna, paginated report and create
                    id: reportId,
                    embedUrl: embedUrl,
                    accessToken: accessToken,
                    tokenType: models.TokenType.Embed,
                    settings: {
                        panes: {
                            filters: {
                                visible: false
                            },
                            pageNavigation: {
                                visible: true
                            }
                        },
                        background: models.BackgroundType.Transparent,
                    }
                }}

                eventHandlers={
                    new Map([
                        ['loaded', function () { console.log('Report loaded'); }],
                        ['rendered', function () { console.log('Report rendered'); }],
                        ['error', function (event) { console.log('PowerBI Error:', event?.detail); }]
                    ])
                }

                cssClassName={"h-full w-full"}

                getEmbeddedComponent={(embeddedReport) => {
                    // Access the embedded report instance if needed
                    // (window as any).report = embeddedReport;
                }}
            />
        </div>
    );
};

export default PowerBIReport;
