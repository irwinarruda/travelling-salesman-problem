export type ExportFileProps = {
    data: any;
    fileName: string;
    contentType: string;
};

export const exportFile = ({
    data,
    contentType,
    fileName,
}: ExportFileProps): void => {
    // eslint-disable-next-line prettier/prettier
    if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) {
        const blob = new Blob([decodeURIComponent(encodeURI(data))], {
            type: contentType,
        });
        (navigator as any).msSaveOrOpenBlob(blob, fileName);
    } else {
        const a = document.createElement('a');
        a.id = 'file-download';
        a.download = fileName;
        a.href = `data:${contentType},${encodeURIComponent(data)}`;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
};
