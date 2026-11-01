// Dependency-free ZIP (STORE) writer for browser-generated PNGs.
const encoder = new TextEncoder();
function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function u16(view: DataView, offset: number, n: number) { view.setUint16(offset,n,true); }
function u32(view: DataView, offset: number, n: number) { view.setUint32(offset,n,true); }
export function buildZip(files: {name:string; bytes:Uint8Array}[]): Blob {
  const chunks: Uint8Array[]=[];const central:Uint8Array[]=[];let offset=0;
  for(const file of files){
    const name=encoder.encode(file.name);const data=file.bytes;const crc=crc32(data);
    const header=new Uint8Array(30+name.length),h=new DataView(header.buffer);
    u32(h,0,0x04034b50);u16(h,4,20);u16(h,6,0x800);u16(h,8,0);u32(h,14,crc);
    u32(h,18,data.length);u32(h,22,data.length);u16(h,26,name.length);header.set(name,30);
    chunks.push(header,data);
    const dir=new Uint8Array(46+name.length),d=new DataView(dir.buffer);
    u32(d,0,0x02014b50);u16(d,4,20);u16(d,6,20);u16(d,8,0x800);
    u16(d,10,0);u32(d,16,crc);u32(d,20,data.length);u32(d,24,data.length);
    u16(d,28,name.length);u32(d,42,offset);dir.set(name,46);central.push(dir);
    offset+=header.length+data.length;
  }
  const centralSize=central.reduce((n,b)=>n+b.length,0);
  const footer=new Uint8Array(22),f=new DataView(footer.buffer);
  u32(f,0,0x06054b50);u16(f,8,files.length);u16(f,10,files.length);
  u32(f,12,centralSize);u32(f,16,offset);
  return new Blob([...chunks,...central,footer],{type:"application/zip"});
}
