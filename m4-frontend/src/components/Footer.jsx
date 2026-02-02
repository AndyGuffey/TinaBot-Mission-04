export default function Footer() {
  return (
    <footer
      className="mt-12 pt-8 border-t-2"
      style={{ borderColor: "#ce1252" }}
    >
      <div className="flex items-center justify-between px-4 py-4 flex-wrap gap-6">
        {/* Forward Software */}
        <div className="flex items-center gap-3">
          <img src="/FSC.png" alt="Forward Software" className="h-10 w-auto" />
          <div className="text-sm">
            <p className="font-semibold" style={{ color: "#ce1252" }}>
              Forward Software
            </p>
            <p className="text-xs text-gray-500">Built by Andy Guffey</p>
          </div>
        </div>

        {/* NZMAI */}
        <div className="flex items-center gap-3">
          <img src="/nzmai-logo.png" alt="NZMAI" className="h-10 w-auto" />
          <div className="text-sm">
            <p className="font-semibold" style={{ color: "#ce1252" }}>
              NZMAI
            </p>
            <p className="text-xs text-gray-500">
              New Zealand Mortgage Adviser Institute
            </p>
          </div>
        </div>

        {/* Copyright Notice */}
        <div className="text-right text-xs text-gray-600">
          {/* <p>© 2026 Andy Guffey. All rights reserved.</p> */}
          <p style={{ color: "#ce1252" }} className="font-semibold">
            Proprietary & Confidential
          </p>
        </div>
      </div>
    </footer>
  );
}
