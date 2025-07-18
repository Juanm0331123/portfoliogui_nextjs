import { NextResponse, type NextRequest } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
    const { name, email, subject, message, type } = await req.json()

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    })

    const htmlContent = `
    <div style="background: linear-gradient(135deg, #020113 0%, #140634 100%); padding: 40px 0;">
      <div style="max-width: 500px; margin: 0 auto; background: #10102E; border-radius: 18px; box-shadow: 0 8px 32px #7C6AD930; padding: 32px; color: #D1D1F0; font-family: 'Noto Sans', Arial, sans-serif;">
        <h2 style="text-align:center; color: #7C6AD9; margin-bottom: 24px;">
          Nuevo mensaje de tu portafolio
        </h2>
        <div style="margin-bottom: 18px;">
          <strong style="color:#23A8C0;">Nombre:</strong> ${name}
        </div>
        <div style="margin-bottom: 18px;">
          <strong style="color:#23A8C0;">Correo:</strong> <a href="mailto:${email}" style="color:#7C6AD9;">${email}</a>
        </div>
        <div style="margin-bottom: 18px;">
          <strong style="color:#23A8C0;">Tipo:</strong> ${
              type === 'service' ? 'Solicitud de servicio' : 'Consulta'
          }
        </div>
        <div style="margin-bottom: 18px;">
          <strong style="color:#23A8C0;">Asunto:</strong> ${subject}
        </div>
        <div style="margin-bottom: 24px;">
          <strong style="color:#23A8C0;">Mensaje:</strong>
          <div style="background:#140634; border-radius:10px; padding:16px; margin-top:8px; color:#D1D1F0;">
            ${message.replace(/\n/g, '<br/>')}
          </div>
        </div>
        <div style="text-align:center; margin-top:32px;">
          <span style="font-size:13px; color:#8A8AAA;">
            © ${new Date().getFullYear()} JuanMiguel Dev · Cali, Colombia
          </span>
        </div>
      </div>
    </div>
    `

    try {
        await transporter.sendMail({
            from: `"${name}" <${email}>`,
            to: process.env.EMAIL_USER,
            subject: `[${type === 'service' ? 'Service' : 'Inquiry'}] ${subject}`,
            html: htmlContent,
        })

        return NextResponse.json({ ok: true })
    } catch (error) {
        return NextResponse.json(
            { ok: false, error: (error as Error).message },
            { status: 500 }
        )
    }
}
