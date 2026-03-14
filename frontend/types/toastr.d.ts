declare module 'toastr' {
    interface ToastrOptions {
        closeButton?: boolean;
        debug?: boolean;
        newestOnTop?: boolean;
        progressBar?: boolean;
        positionClass?: string;
        preventDuplicates?: boolean;
        onclick?: () => void;
        showDuration?: number;
        hideDuration?: number;
        timeOut?: number;
        extendedTimeOut?: number;
        showEasing?: string;
        hideEasing?: string;
        showMethod?: string;
        hideMethod?: string;
    }

    interface Toastr {
        options: ToastrOptions;
        success(message: string, title?: string, options?: ToastrOptions): void;
        info(message: string, title?: string, options?: ToastrOptions): void;
        warning(message: string, title?: string, options?: ToastrOptions): void;
        error(message: string, title?: string, options?: ToastrOptions): void;
        clear(): void;
        remove(): void;
        configure(options?: ToastrOptions): void;
    }

    const toastr: Toastr;
    export = toastr;
}
